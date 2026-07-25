import { NextResponse } from 'next/server'

export function middleware(request) {
  // Redirection automatique
  if (request.nextUrl.pathname === '/admin') {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
