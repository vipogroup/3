export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth/requireAuth';

function createLogoutResponse() {
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  );
  clearAuthCookie(response);
  return response;
}

export function POST(request) {
  return createLogoutResponse();
}

export function GET(request) {
  return createLogoutResponse();
}
