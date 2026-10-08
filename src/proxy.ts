import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Read Auth Cookies
  const authToken = request.cookies.get("pulse_auth_token")?.value;
  const userRole = request.cookies.get("pulse_user_role")?.value;
  const isAuthenticated = Boolean(authToken);

  // 2. Auth Routes Redirect for Already Authenticated Users
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";
  if (isAuthRoute && isAuthenticated && userRole) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (userRole === "DRIVER") {
      return NextResponse.redirect(new URL("/provider", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Admin Protected Routes (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "ADMIN") {
      const target = userRole === "DRIVER" ? "/provider" : "/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  // 4. Driver / Provider Protected Routes (/provider/*)
  if (pathname.startsWith("/provider")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "DRIVER") {
      const target = userRole === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  // 5. Patient Protected Routes (/dashboard/*)
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "PATIENT") {
      const target = userRole === "ADMIN" ? "/admin" : "/provider";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/provider/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
