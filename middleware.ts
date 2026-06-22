import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-aijlvbipvqnvbywxhlbd-auth-token')?.value
  let isLoggedIn = false
  if (token) {
    try {
      const parsed = JSON.parse(token)
      const accessToken = Array.isArray(parsed) ? parsed[0] : parsed?.access_token
      if (accessToken) {
        const supabase = createClient('https://aijlvbipvqnvbywxhlbd.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
        const { data } = await supabase.auth.getUser(accessToken)
        isLoggedIn = !!data.user
      }
    } catch (_) { isLoggedIn = false }
  }
  const path = req.nextUrl.pathname
  if (path.startsWith('/dashboard') && !isLoggedIn) return NextResponse.redirect(new URL('/auth/login', req.url))
  if ((path === '/auth/login' || path === '/auth/register') && isLoggedIn) return NextResponse.redirect(new URL('/dashboard', req.url))
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login', '/auth/register'],
}
