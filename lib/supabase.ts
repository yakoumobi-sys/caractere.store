import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  return createClient(url, key)
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(url, key, { auth: { persistSession: false } })
}

export const supabaseClient = getSupabaseClient()
export const supabase = supabaseClient
export const supabaseAdmin = getSupabaseAdmin()