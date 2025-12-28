import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const headersList = headers();
  
  let role = null;
  let hasAnyToken = false;
  
  // Try NextAuth token - create proper request-like object
  try {
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');
    
    const req = {
      headers: {
        cookie: cookieHeader,
      },
      cookies: Object.fromEntries(allCookies.map(c => [c.name, c.value])),
    };
    
    const nextAuthToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (nextAuthToken) {
      hasAnyToken = true;
      if (nextAuthToken.role) {
        role = nextAuthToken.role;
      }
    }
  } catch (e) {
    console.error('[Dashboard] NextAuth token error:', e.message);
  }
  
  // Fallback to legacy JWT token
  if (!role) {
    const legacyToken = cookieStore.get('auth_token')?.value || cookieStore.get('token')?.value;
    if (legacyToken) {
      hasAnyToken = true;
      try {
        const payload = jwt.verify(legacyToken, process.env.JWT_SECRET);
        role = payload.role;
      } catch (e) {
        console.error('[Dashboard] Legacy token error:', e.message);
      }
    }
  }
  
  // No valid session found - only redirect if no token at all
  if (!hasAnyToken) {
    redirect('/login');
  }
  
  // If we have a token but no role, default to customer behavior
  if (!role) {
    role = 'customer';
  }
  
  // Redirect based on user role
  if (role === 'admin') {
    redirect('/admin');
  } else if (role === 'agent') {
    redirect('/agent/dashboard-improved');
  } else {
    // Customer - redirect to products/orders
    redirect('/products');
  }
}
