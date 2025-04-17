import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  exp: number
}

// Function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

// Add paths that don't require authentication
const publicPaths = ['/']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    // If user is authenticated and tries to access public routes, redirect to dashboard
    if (token && !isTokenExpired(token)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Check if user is authenticated for protected routes
  if (!token || isTokenExpired(token)) {
    // Clear expired token and redirect to root
    const response = NextResponse.redirect(new URL('/', request.url))
    if (token) {
      response.cookies.delete('token')
    }
    return response
  }

  return NextResponse.next()
}

// Configure paths that trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
