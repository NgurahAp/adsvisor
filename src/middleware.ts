import { verifyJwtEdge } from "@/lib/jwt-edge";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  console.log("Middleware:", { pathname, hasToken: !!token });

  // Jika di halaman login/register dan sudah ada token valid, redirect ke dashboard
  if ((pathname === "/login" || pathname === "/register") && token) {
    const verified = await verifyJwtEdge(token);
    console.log("Auth page with token, verified:", !!verified);
    if (verified) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Jika di dashboard dan tidak ada token, redirect ke login
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      console.log("Dashboard without token, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    const verified = await verifyJwtEdge(token);
    console.log("Dashboard with token, verified:", !!verified);
    if (!verified) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
