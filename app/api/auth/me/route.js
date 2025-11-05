import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const headers = Object.fromEntries(req.headers.entries());

    // 1) Try Cookie first
    const tokenFromCookie = (headers.cookie || '')
      .split('; ')
      .find(s => s.startsWith('token='))?.split('=')[1];

    // 2) Fallback to Authorization: Bearer
    const auth = headers.authorization || '';
    const tokenFromHeader = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    const token = tokenFromCookie || tokenFromHeader;
    if (!token) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ ok: true, sub: payload.sub, role: payload.role });
  } catch (e) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
}
