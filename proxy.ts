import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Route protection proxy (Next.js 16 uses proxy.ts, not middleware.ts).
 *
 * - /dashboard/* requires a valid auth token (tv_token cookie)
 * - /login and /register redirect already-authenticated users to /dashboard
 */
export default function proxy(request: NextRequest) {
  // Accept both the legacy 'token' cookie and the new 'tv_token' cookie
  const token =
    request.cookies.get('tv_token')?.value ||
    request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Auth routes (redirect to dashboard if already logged in)
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
