import { NextResponse } from "next/server";

function resolveRedirectUrl(request) {
  const hostHeader = request.headers.get("host");
  if (hostHeader) {
    const protocol = request.nextUrl.protocol || "http:";
    return new URL("/login", `${protocol}//${hostHeader}`);
  }

  if (process.env.PUBLIC_URL) {
    try {
      return new URL("/login", process.env.PUBLIC_URL);
    } catch (_) {
      // ignore invalid PUBLIC_URL
    }
  }

  return new URL("/login", request.url);
}

function createLogoutResponse(request) {
  const redirectUrl = resolveRedirectUrl(request);
  const response = NextResponse.redirect(redirectUrl);

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };

  response.cookies.set("auth_token", "", cookieOptions);
  // Remove legacy token cookie if it exists
  response.cookies.set("token", "", cookieOptions);

  return response;
}

export function POST(request) {
  return createLogoutResponse(request);
}

export function GET(request) {
  return createLogoutResponse(request);
}
