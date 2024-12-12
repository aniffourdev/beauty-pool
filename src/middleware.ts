// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("access_token");
//   const isAuthPage = request.nextUrl.pathname.startsWith("/login");

//   if (!token && !isAuthPage) {
//     // Redirect to login if not authenticated
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if (token && isAuthPage) {
//     // Redirect to dashboard if authenticated and trying to access auth page
//     return NextResponse.redirect(new URL("/profile", request.url));
//   }

//   return NextResponse.next();
// }

// // Apply middleware to specific routes
// export const config = {
//   matcher: ["/business/:path*", "/profile/:path*", "/auth/:path*"],
// };