import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'yakoumobi@gmail.com'

/**
 * Vérifie que la requête provient de l'admin authentifié.
 * Le client doit envoyer le header: Authorization: Bearer <access_token supabase>
 * Retourne null si OK, sinon une NextResponse 401 à renvoyer directement.
 */
export async function requireAdmin(req: Request): Promise<NextResponse | null> {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()

  if (!token) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !data?.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  if ((data.user.email || '').toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  return null
}
