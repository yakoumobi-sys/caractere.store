// app/api/auth/login/route.ts
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "15m"),
})

function getIP(request: NextRequest) {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         '127.0.0.1'
}

export async function POST(request: NextRequest) {
  const ip = getIP(request)
  
  // Vérifier rate limit
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
      { status: 429 }
    )
  }

  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email et mot de passe requis' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    )
  }

  return NextResponse.json({ data })
}
