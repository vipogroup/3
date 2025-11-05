import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';

const isProd = () => process.env.NODE_ENV === 'production';
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || '').trim());

export async function POST(req) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'BAD_CREDENTIALS' }, { status: 401 });
    }

    // שלב ראשון: תומכים רק באימייל (נרחיב לטלפון בעתיד בלי לשנות חוזה)
    if (!isEmail(identifier)) {
      return NextResponse.json({ error: 'EMAIL_REQUIRED' }, { status: 401 });
    }

    const email = identifier.toLowerCase().trim();
    const db = await getDb();
    const users = db.collection('users');

    const user = await users.findOne({ email });
    if (!user?.password || user.isActive === false) {
      return NextResponse.json({ error: 'BAD_CREDENTIALS' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ error: 'BAD_CREDENTIALS' }, { status: 401 });

    const token = jwt.sign(
      { sub: String(user._id), role: user.role || 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const res = NextResponse.json({ ok: true, role: user.role || 'customer' });
    res.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd(),   // לוקאל: false; פרוד: true
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch (e) {
    console.error('LOGIN_ERROR', e);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
