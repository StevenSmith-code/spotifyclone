import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  // allow the req if the following is true
  // 1. If the token exists
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  //   Redirect them to login if no token is present
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
