import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    req.nextUrl.origin;
  const target = new URL("/api/auth/google", appUrl);
  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });
  return NextResponse.redirect(target.toString());
}


