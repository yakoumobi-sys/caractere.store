import { supabaseClient } from '@/lib/supabase'

/**
 * fetch() avec le token de session Supabase attaché en Authorization.
 * À utiliser pour tous les appels API depuis l'espace admin.
 */
export async function adminFetch(url: string, options: RequestInit = {}) {
  const { data: { session } } = await supabaseClient.auth.getSession()
  const headers = new Headers(options.headers || {})
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`)
  }
  return fetch(url, { ...options, headers })
}
