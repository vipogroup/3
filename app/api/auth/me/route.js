import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const headers = Object.fromEntries(req.headers.entries());

    // 1) Try Cookie first (auth_token from login)
    const tokenFromCookie = (headers.cookie || '')
      .split('; ')
      .find((s) => s.startsWith('auth_token='))
      ?.split('=')[1];

    // 2) Fallback to Authorization: Bearer
    const auth = headers.authorization || '';
    const tokenFromHeader = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    const token = tokenFromCookie || tokenFromHeader;
    if (!token) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Return user object expected by dashboard
    return NextResponse.json({
      ok: true,
      user: {
        _id: payload.sub || payload.userId,
        email: payload.email,
        fullName: payload.fullName || payload.email,
        phone: payload.phone,
        role: payload.role || 'admin',
        name: payload.fullName || payload.email, // Alias for some components
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
}
