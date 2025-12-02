import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth/requireAuth';

function resolveRedirectUrl(request) {
  const hostHeader = request.headers.get('host');
  if (hostHeader) {
    const protocol = request.nextUrl.protocol || 'http:';
    return new URL('/login', `${protocol}//${hostHeader}`);
  }

  if (process.env.PUBLIC_URL) {
    try {
      return new URL('/login', process.env.PUBLIC_URL);
    } catch (_) {
      // ignore invalid PUBLIC_URL
    }
  }

  return new URL('/login', request.url);
}

function createLogoutResponse(request) {
  const redirectUrl = resolveRedirectUrl(request);
  const response = NextResponse.redirect(redirectUrl);
  clearAuthCookie(response);

  return response;
}

export function POST(request) {
  return createLogoutResponse(request);
}

export function GET(request) {
  return createLogoutResponse(request);
}
