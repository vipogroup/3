export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

/**
 * Short referral link redirect
 * /r/CODE -> redirects to /products with coupon applied
 */
export async function GET(req, context) {
  const params = await context.params;
  const code = params?.code;
  
  if (!code) {
    return NextResponse.redirect(new URL('/products', req.url));
  }

  // Use request URL origin for redirect
  const url = new URL(req.url);
  const redirectUrl = new URL('/products', url.origin);
  
  const response = NextResponse.redirect(redirectUrl);

  const cookieOptions = {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
  };

  // Set referral and coupon cookies
  response.cookies.set('refSource', code, cookieOptions);
  response.cookies.set('autoCoupon', code, cookieOptions);

  return response;
}
