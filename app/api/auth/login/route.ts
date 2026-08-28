// app/api/auth/login/route.ts
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const hasUpstash = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

const ratelimit = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "15m"),
    })
  : null

function getIP(request: NextRequest) {
  return request.headers.get('x-forwarded-for') ||
         request.headers.get('x-real-ip') ||
         '127.0.0.1'
}

export async function POST(request: NextRequest) {
  const ip = getIP(request)

  if (ratelimit) {
    const { success } = await ratelimit.limit(`login:${ip}`)
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
        { status: 429 }
      )
    }
  }

  try {
    const body = await request.json()
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    if (error) {
      // Logging pour sécurité (possibilité d'attaque)
      console.warn(`Failed login attempt for ${email} from ${ip}`)
      // Ne pas révéler si l'email existe
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Erreur sur /api/auth/login:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
