import { NextResponse } from 'next/server'

export function middleware(request) {
  const pathname = request.nextUrl.pathname

  // N'inclure que /admin et /client dans la protection
  if (pathname.startsWith('/admin') || pathname.startsWith('/client')) {
    const token = request.cookies.get('sb-token')?.value
    
    if (!token) {
      // Admin → /admin/login
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      // Client → /auth/login
      if (pathname.startsWith('/client')) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*']
}
