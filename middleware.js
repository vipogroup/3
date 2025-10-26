import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { verifyJwt } from "./src/lib/auth/createToken.js";

const PUBLIC_PATTERNS = [
  /^\/$/,
  /^\/products(?:\/.*)?$/,
  /^\/api\/products(?:\/.*)?$/,
  /^\/api\/auth(?:\/.*)?$/,
  /^\/manifest\.webmanifest$/,
  /^\/icons(?:\/.*)?$/,
];

function isPublic(pathname) {
  return PUBLIC_PATTERNS.some((pattern) => pattern.test(pathname));
}

async function verifyJWT(token, secret) {
  const enc = new TextEncoder();
  const { payload } = await jwtVerify(token, enc.encode(secret));
  return payload;
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Stage 3: explicit guards for protected app areas
  const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/agent");
  if (isProtected) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const decoded = verifyJwt(token);
    if (!decoded?.role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/agent") && decoded.role !== "agent") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (isPublic(pathname)) return NextResponse.next();

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/?auth=required", req.url));
  }

  try {
    const payload = await verifyJWT(token, process.env.JWT_SECRET || "");
    const role = String(payload.role || "");

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/?auth=forbidden", req.url));
    }
    if (pathname.startsWith("/agent") && !["agent", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/?auth=forbidden", req.url));
    }

    const res = NextResponse.next();
    if (payload.userId) res.headers.set("x-user-id", String(payload.userId));
    if (payload.role) res.headers.set("x-user-role", String(payload.role));
    return res;
  } catch {
    return NextResponse.redirect(new URL("/?auth=invalid", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*"],
};
