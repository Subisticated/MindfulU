import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to auth pages without token
        if (pathname.startsWith("/auth/")) {
          return true
        }
        
        // Allow access to public pages
        if (pathname === "/") {
          return true
        }
        
        // Allow access to onboarding for authenticated users
        if (pathname === "/onboarding") {
          return !!token
        }
        
        // Require token for all other protected pages
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}
