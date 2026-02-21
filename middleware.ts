import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DASHBOARD_PREFIX = "/dashboard";
const ROLE_COOKIE = "campusrun_role";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(DASHBOARD_PREFIX)) {
    return NextResponse.next();
  }

  const role = request.cookies.get(ROLE_COOKIE)?.value;

  if (!role) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (role === "superadmin") {
    return NextResponse.next();
  }

  if (role === "admin") {
    if (pathname.startsWith("/dashboard/admins")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (role === "support") {
    if (
      pathname === "/dashboard/reports" ||
      pathname.startsWith("/dashboard/reports")
    ) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/reports";
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("redirect", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

