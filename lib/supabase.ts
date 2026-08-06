import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  // createBrowserClient (au lieu du createClient "brut") écrit aussi la session
  // dans un cookie, pas seulement le localStorage — indispensable pour que
  // middleware.ts (qui protège /admin côté serveur via les cookies) reconnaisse
  // l'utilisateur juste après la connexion.
  return createBrowserClient(url, key)
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(url, key, { auth: { persistSession: false } })
}

export const supabaseClient = getSupabaseClient()
export const supabase = supabaseClient
export const supabaseAdmin = getSupabaseAdmin()