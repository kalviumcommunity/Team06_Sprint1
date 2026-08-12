import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAuthPage =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  const isProtectedUserRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/medicines") ||
    nextUrl.pathname.startsWith("/subscriptions") ||
    nextUrl.pathname.startsWith("/profile") ||
    nextUrl.pathname.startsWith("/notifications") ||
    nextUrl.pathname.startsWith("/settings");

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // Unauthenticated: redirect to /login
  if (!isLoggedIn && (isProtectedUserRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Non-admin accessing /admin/*: redirect to /dashboard
  if (isLoggedIn && isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Admin accessing user-only dashboard: redirect to /admin/dashboard
  if (isLoggedIn && nextUrl.pathname === "/dashboard" && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
  }

  // Logged-in user on auth pages: redirect to appropriate dashboard
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(
      new URL(role === "ADMIN" ? "/admin/dashboard" : "/dashboard", nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/medicines/:path*",
    "/subscriptions/:path*",
    "/profile/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
