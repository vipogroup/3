import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

export default async function DashboardPage() {
  // Check for NextAuth token first
  const cookieStore = cookies();
  const req = {
    cookies: Object.fromEntries(
      cookieStore.getAll().map(c => [c.name, c.value])
    ),
  };
  
  let role = null;
  
  // Try NextAuth token
  try {
    const nextAuthToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (nextAuthToken?.role) {
      role = nextAuthToken.role;
    }
  } catch (e) {
    // NextAuth token not available
  }
  
  // Fallback to legacy JWT token
  if (!role) {
    const legacyToken = cookieStore.get('auth_token')?.value || cookieStore.get('token')?.value;
    if (legacyToken) {
      try {
        const payload = jwt.verify(legacyToken, process.env.JWT_SECRET);
        role = payload.role;
      } catch (e) {
        // Invalid legacy token
      }
    }
  }
  
  // No valid session found
  if (!role) {
    redirect('/login');
  }
  
  // Redirect based on user role
  if (role === 'admin') {
    redirect('/admin');
  } else if (role === 'agent') {
    redirect('/agent');
  } else if (role === 'business_admin') {
    redirect('/business');
  } else {
    // Customer or any other role - redirect to shop
    redirect('/shop');
  }
}
