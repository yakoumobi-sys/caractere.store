import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/api-auth'

const STATUSES = ['nouveau', 'en_cours', 'termine', 'annule'] as const

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Requête invalide' }, { status: 400 }) }
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })

  const patch: Record<string, unknown> = {}
  if (Object.prototype.hasOwnProperty.call(body, 'statut')) {
    if (!STATUSES.includes(body.statut)) return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    patch.statut = body.statut
  }
  if (body.confirm_payment === true) patch.paid_confirmed_at = new Date().toISOString()
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'Aucune modification autorisée' }, { status: 400 })

  const { data, error } = await supabaseAdmin.from('commandes').update(patch).eq('id', params.id).select().single()
  if (error || !data) return NextResponse.json({ error: 'Mise à jour impossible' }, { status: 400 })

  let pointsCredited: number | null = null
  let loyaltyWarning: string | null = null
  if (data.statut === 'termine' && data.paid_confirmed_at && data.user_id) {
    const member = await supabaseAdmin.from('privilege_members').select('user_id').eq('user_id', data.user_id).maybeSingle()
    if (member.data) {
      const result = await supabaseAdmin.rpc('privilege_credit_order', { p_user_id: data.user_id, p_order_id: data.id })
      if (result.error && result.error.code !== '23505') {
        loyaltyWarning = 'Commande mise à jour, mais crédit Privilège à vérifier.'
        console.error('[privilege] order credit failed:', result.error.code)
      } else if (!result.error) {
        pointsCredited = result.data
      }
    }
  }
  return NextResponse.json({ ...data, loyalty_points_credited: pointsCredited, loyalty_warning: loyaltyWarning })
}
