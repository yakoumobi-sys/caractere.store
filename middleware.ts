// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'yakoumobi@gmail.com').toLowerCase()

// Rate limiter pour login (5 tentatives par 15 min)
const loginRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15m'),
})

// Rate limiter pour API admin (30 requêtes par minute par IP)
const apiRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, '1m'),
})

// Fonction pour extraire l'IP
function getIP(request: NextRequest) {
  return request.headers.get('x-forwarded-for') ||
         request.headers.get('x-real-ip') ||
         '127.0.0.1'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getIP(request)

  // ========== RATE LIMIT SUR /auth/login ==========
  if (pathname === '/auth/login' && request.method === 'POST') {
    const { success } = await loginRatelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
        { status: 429 }
      )
    }
  }

  // ========== RATE LIMIT SUR API ADMIN ==========
  if ((pathname.startsWith('/api/admin') || pathname.startsWith('/api/leads')) &&
      request.method !== 'GET') {
    const { success } = await apiRatelimit.limit(`${ip}:admin-api`)
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez dans 1 minute.' },
        { status: 429 }
      )
    }
  }

  // ========== PROTÉGER /admin ==========
  if (pathname.startsWith('/admin')) {
    let response = NextResponse.next({
      request: { headers: request.headers },
    })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/auth/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  }

  // ========== PROTÉGER LES ROUTES API ADMIN ==========
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/leads')) {
    let response = NextResponse.next({
      request: { headers: request.headers },
    })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    })

    const { data: cookieData } = await supabase.auth.getUser()
    let user = cookieData.user
    if (!user) {
      const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim()
      if (token) user = (await supabase.auth.getUser(token)).data.user
    }
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Accès administrateur refusé' }, { status: 403 })
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/leads/:path*', '/auth/login'],
}
