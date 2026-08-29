// app/api/auth/register/route.ts
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const hasUpstash = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

const ratelimit = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1h'), // 5 inscriptions par heure par IP
    })
  : null

function getIP(request: NextRequest) {
  return request.headers.get('x-forwarded-for') ||
         request.headers.get('x-real-ip') ||
         '127.0.0.1'
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isStrongPassword(password: string): boolean {
  // Minimum 8 caractères, au moins 1 majuscule, 1 minuscule, 1 chiffre
  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
}

export async function POST(request: NextRequest) {
  const ip = getIP(request)

  // Rate limiting sur inscription
  if (ratelimit) {
    const { success } = await ratelimit.limit(`register:${ip}`)
    if (!success) {
      return NextResponse.json(
        { error: 'Trop d\'inscriptions. Réessayez dans 1 heure.' },
        { status: 429 }
      )
    }
  }

  try {
    const body = await request.json()
    const { email, password } = body as { email?: string; password?: string }

    // Validation basique
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Validation email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Format email invalide' },
        { status: 400 }
      )
    }

    // Validation mot de passe fort
    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { error: 'Mot de passe faible (min 8 chars, 1 majuscule, 1 minuscule, 1 chiffre)' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
    })

    if (error) {
      // Ne pas révéler si l'email existe déjà
      if (error.message?.includes('already registered')) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        )
      }
      console.error('Erreur registration:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'inscription' },
        { status: 400 }
      )
    }

    return NextResponse.json({ data, message: 'Vérifiez votre email pour confirmer' })
  } catch (error) {
    console.error('Erreur sur /api/auth/register:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
