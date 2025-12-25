export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

/**
 * Short referral link redirect
 * /r/CODE -> redirects to /products with coupon applied
 */
export async function GET(req, { params }) {
  const { code } = await params;
  
  if (!code) {
    return NextResponse.redirect(new URL('/products', req.url));
  }

  const baseUrl = process.env.PUBLIC_URL || 'https://vipo-group.com';
  const redirectUrl = new URL('/products', baseUrl);
  
  const response = NextResponse.redirect(redirectUrl);

  const cookieOptions = {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  };

  // Set referral and coupon cookies
  response.cookies.set('refSource', code, cookieOptions);
  response.cookies.set('autoCoupon', code, cookieOptions);

  return response;
}
