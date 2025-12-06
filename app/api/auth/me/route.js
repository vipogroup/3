import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth/requireAuth';
import { verify as verifyJwt } from '@/lib/auth/createToken';

export async function GET(req) {
  try {
    const headers = Object.fromEntries(req.headers.entries());
    const authHeader = headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    const token = getAuthToken(req) || bearerToken;
    if (!token) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const payload = verifyJwt(token);
    console.log('[AUTH_ME_DEBUG]', { hasToken: !!token, decoded: !!payload });

    if (!payload) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

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
