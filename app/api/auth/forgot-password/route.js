import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/email";

function resolveOrigin(request) {
  const originHeader = request.headers.get("origin");
  if (originHeader) {
    return originHeader;
  }

  const protocol = request.nextUrl?.protocol || "http:";
  const host = request.headers.get("host");
  if (host) {
    return `${protocol}//${host}`;
  }

  if (process.env.PUBLIC_URL) {
    return process.env.PUBLIC_URL.replace(/\/$/, "");
  }

  const url = new URL(request.url);
  url.pathname = "";
  url.search = "";
  return url.toString().replace(/\/$/, "");
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    const email = String(body?.email || "").toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ ok: false, error: "missing_email" }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection("users");
    const user = await users.findOne({ email });

    if (!user) {
      // אל תחשוף אם המשתמש לא קיים
      return NextResponse.json({ ok: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 דקות

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordResetToken: hashedToken,
          passwordResetExpires: expires,
        },
      }
    );

    const origin = resolveOrigin(request);
    const resetLink = `${origin}/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: "איפוס סיסמה - VIPO",
      text: `שלום ${user.fullName || ""},\n\nקיבלת בקשה לאיפוס סיסמה. ניתן לאפס באמצעות הקישור: ${resetLink}\n\nאם לא ביקשת איפוס, ניתן להתעלם מההודעה.`,
      html: `
        <p>שלום ${user.fullName || ""},</p>
        <p>התקבלה בקשה לאיפוס הסיסמה שלך במערכת VIPO.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px">
            לאיפוס סיסמה לחץ כאן
          </a>
        </p>
        <p>הקישור בתוקף למשך 30 דקות. אם לא ביקשת איפוס, ניתן להתעלם מהודעה זו.</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
