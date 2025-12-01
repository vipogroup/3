import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/hash";

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    const token = String(body?.token || "");
    const password = String(body?.password || "");

    if (!token || !password) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: "password_too_short" }, { status: 400 });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const db = await getDb();
    const users = db.collection("users");

    const now = new Date();

    const user = await users.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: now },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: "invalid_or_expired" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await users.updateOne(
      { _id: user._id },
      {
        $set: { passwordHash },
        $unset: { passwordResetToken: "", passwordResetExpires: "" },
      }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
