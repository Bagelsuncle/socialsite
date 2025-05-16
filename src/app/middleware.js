import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/api/auth",
    "/forgot-password",
  ];

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // Auth pages that should redirect to profile if already authenticated
  const authPages = ["/login", "/signup"];
  const isAuthPage = authPages.includes(pathname);

  // Redirect logic
  if (!token && !isPublicPath) {
    // Redirect to login if not authenticated and trying to access protected route
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  if (token && isAuthPage) {
    // Redirect to profile if already authenticated and trying to access login/signup
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

// Configure which paths middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images folder
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|assets|public).*)",
  ],
};
