import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard secure API routes
  if (!pathname.startsWith("/api/secure")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized" }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/secure/:path*"],
};
