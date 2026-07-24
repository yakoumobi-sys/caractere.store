// app/api/auth/logout/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string) {
          cookieStore.set(name, value)
        },
        remove(name: string) {
          cookieStore.delete(name)
        },
      },
    }
  )

  await supabase.auth.signOut()
  
  return NextResponse.json({ success: true })
}
