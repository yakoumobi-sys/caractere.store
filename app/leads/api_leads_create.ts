// app/api/leads/create.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function POST(req: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    let response = NextResponse.next({
      request: {
        headers: req.headers,
      },
    })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // 2. Parser le body
    const body = await req.json()
    const { nom, telephone, email, entreprise, wilaya, source, tags } = body

    // 3. Validation basique
    if (!nom || !telephone) {
      return NextResponse.json(
        { error: 'nom et telephone sont requis' },
        { status: 400 }
      )
    }

    // 4. Insérer la lead dans Supabase
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        nom,
        telephone,
        email,
        entreprise,
        wilaya,
        source: source || 'web',
        tags: tags || [],
        user_id: user.id, // Lier à l'utilisateur
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create lead', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        lead: data?.[0],
        message: 'Lead créée avec succès',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}