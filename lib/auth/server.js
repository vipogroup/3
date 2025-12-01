import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

function getRawToken(store) {
  return (
    store.get("auth_token")?.value ||
    store.get("token")?.value ||
    store.get("next-auth.session-token")?.value ||
    store.get("__Secure-next-auth.session-token")?.value ||
    null
  );
}

function normalizeUser(payload) {
  if (!payload) return null;

  // Support payloads like { user: {...} }
  const base = payload.user ?? payload;
  if (!base) return null;

  const id = base.id || base._id || base.sub || payload.sub || null;
  const role = base.role || payload.role || null;

  if (!id) return null;
  return { id: String(id), role: role || null, raw: base };
}

export async function getUserFromCookies() {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const store = cookies();
    const rawToken = getRawToken(store);
    if (!rawToken) return null;

    const payload = jwt.verify(rawToken, secret);
    return normalizeUser(payload);
  } catch (error) {
    return null;
  }
}

export async function isAdmin() {
  const user = await getUserFromCookies();
  return user?.role === "admin";
}

export async function requireAdmin() {
  const user = await getUserFromCookies();
  if (!user || user.role !== "admin") {
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }
  return user;
}
