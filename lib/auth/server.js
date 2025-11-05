import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/**
 * Get user from cookies (Server Component only)
 * @returns {Object|null} - User object with { sub, role } or null
 */
export async function getUserFromCookies() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) return null;
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return {
      id: payload.sub,
      role: payload.role,
    };
  } catch (e) {
    return null;
  }
}

/**
 * Check if user is admin
 * @returns {boolean}
 */
export async function isAdmin() {
  const user = await getUserFromCookies();
  return user?.role === "admin";
}

/**
 * Require admin role or redirect
 * Use in Server Components
 */
export async function requireAdmin() {
  const user = await getUserFromCookies();
  
  if (!user || user.role !== "admin") {
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }
  
  return user;
}
