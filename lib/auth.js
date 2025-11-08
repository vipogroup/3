import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getDb } from "./db";

export function signJWT(payload, expiresIn = "7d") {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

export function verifyJWT(token) {
  try { return jwt.verify(token, process.env.JWT_SECRET); }
  catch(e){ return null; }
}

// OTP store is in-memory for dev; use Mongo in production with TTL index.
const _otp = new Map();

export async function sendOTP(phone) {
  const code = ("" + Math.floor(100000 + Math.random()*900000));
  const expires = Date.now() + 5*60*1000;
  _otp.set(phone, { code, expires });

  // Twilio WhatsApp/SMS stub
  console.log("[OTP] sending code to", phone, "code:", code);
  return true;
}

export async function verifyOTP(phone, code) {
  const rec = _otp.get(phone);
  if (!rec) return false;
  if (Date.now() > rec.expires) return false;
  if (rec.code !== code) return false;
  _otp.delete(phone);
  return true;
}

export async function ensureUser(phone, role="agent") {
  const db = await getDb();
  let user = await db.collection("users").findOne({ phone });
  if (!user) {
    user = { phone, role, createdAt: new Date() };
    await db.collection("users").insertOne(user);
  }
  return user;
}

function getTokenFromCookieHeader(header) {
  if (!header) return null;
  const parts = header.split(";");
  for (const part of parts) {
    const [key, ...rest] = part.trim().split("=");
    if (key === "auth_token") {
      return rest.join("=");
    }
  }
  return null;
}

export async function requireAdmin(options = {}) {
  const tokenOverride = getTokenFromCookieHeader(options.cookie);
  const token = tokenOverride ?? cookies().get("auth_token")?.value;
  if (!token) return { ok: false, status: 401, error: "Unauthorized" };

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") {
      return { ok: false, status: 403, error: "Admin only" };
    }
    return { ok: true, userId: payload.userId };
  } catch {
    return { ok: false, status: 401, error: "Invalid token" };
  }
}
