import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { verifyJwt } from '@/src/lib/auth/createToken.js';
import { comparePassword as compare, hashPassword as hash } from '@/src/lib/auth/hash.js';
import { getDb } from '@/lib/db';

async function usersCollection() {
  const dbo = await getDb();
  return dbo.collection('users');
}

async function POSTHandler(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = token ? verifyJwt(token) : null;
    if (!decoded?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'הסיסמה חייבת להכיל לפחות 8 תווים' }, { status: 400 });
    }
    if (!/\d/.test(newPassword)) {
      return NextResponse.json({ error: 'הסיסמה חייבת להכיל לפחות מספר אחד' }, { status: 400 });
    }
    if (!/[a-zA-Zא-ת]/.test(newPassword)) {
      return NextResponse.json({ error: 'הסיסמה חייבת להכיל לפחות אות אחת' }, { status: 400 });
    }

    const col = await usersCollection();
    const user = await col.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const ok = await compare(oldPassword, user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Invalid old password' }, { status: 400 });

    const passwordHash = await hash(newPassword);
    await col.updateOne({ _id: user._id }, { $set: { passwordHash } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const POST = withErrorLogging(POSTHandler);
