import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_only_local";

export async function requireAgent() {
  await dbConnect();

  const jar = cookies();
  const token = jar.get("auth_token")?.value;
  if (!token) {
    return { ok: false, status: 401, error: "Missing auth token" };
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return { ok: false, status: 401, error: "Invalid token" };
  }

  const userId = payload?.userId || payload?.sub;
  if (!userId) {
    return { ok: false, status: 401, error: "Invalid token payload" };
  }

  const user = await User.findById(userId).lean();
  if (!user) {
    return { ok: false, status: 401, error: "User not found" };
  }
  if (!user.isAgent || !user.agentId) {
    return { ok: false, status: 403, error: "Agent only" };
  }

  return {
    ok: true,
    user: {
      _id: String(user._id),
      agentId: String(user.agentId),
      email: user.email ?? null,
    },
  };
}
