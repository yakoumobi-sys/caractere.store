import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// createBrowserClient() (comme createClient()) lève une exception si l'url ou
// la clé est vide. Comme ce module est importé au niveau racine par plusieurs
// pages ('use client'), une variable d'env manquante ferait planter l'import
// lui-même — et donc toute la page qui l'importe (écran blanc, cf. app/error.tsx)
// au lieu d'une simple erreur réseau/auth normale et rattrapable. On préfère
// donc dégrader proprement : logguer l'anomalie et retomber sur des valeurs
// factices non vides pour que la construction du client ne puisse jamais crasher
// le rendu — seuls les appels Supabase échoueront alors, normalement.
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error(
      '[supabase] NEXT_PUBLIC_SUPABASE_URL et/ou NEXT_PUBLIC_SUPABASE_ANON_KEY manquent — ' +
      'le client Supabase est initialisé avec des valeurs factices pour éviter de faire planter la page.'
    )
  }

  // createBrowserClient (au lieu du createClient "brut") écrit aussi la session
  // dans un cookie, pas seulement le localStorage — indispensable pour que
  // middleware.ts (qui protège /admin côté serveur via les cookies) reconnaisse
  // l'utilisateur juste après la connexion.
  return createBrowserClient(
    url || 'https://placeholder.invalid',
    key || 'placeholder-key'
  )
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error(
      '[supabase] NEXT_PUBLIC_SUPABASE_URL et/ou SUPABASE_SERVICE_ROLE_KEY manquent côté serveur — ' +
      'le client admin est initialisé avec des valeurs factices pour éviter de faire planter la requête.'
    )
  }

  return createClient(
    url || 'https://placeholder.invalid',
    key || 'placeholder-key',
    { auth: { persistSession: false } }
  )
}

export const supabaseClient = getSupabaseClient()
export const supabase = supabaseClient
export const supabaseAdmin = getSupabaseAdmin()