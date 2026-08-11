import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/api-auth'

// POST /api/avis — soumission publique d'un avis (toujours "en_attente", jamais publié direct)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const nom = (body.nom || '').toString().trim()
    const commentaire = (body.commentaire || '').toString().trim()
    const note = Number(body.note)

    if (!nom || !commentaire) {
      return NextResponse.json({ error: 'Nom et commentaire requis' }, { status: 400 })
    }
    if (!Number.isInteger(note) || note < 1 || note > 5) {
      return NextResponse.json({ error: 'Note invalide (1 à 5)' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('avis')
      .insert([{ nom, note, commentaire, statut: 'en_attente' }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Avis error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// GET /api/avis — liste publique des avis approuvés uniquement.
// GET /api/avis?all=1 — liste complète (admin uniquement), pour la modération.
export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all')

  if (all) {
    const denied = await requireAdmin(req)
    if (denied) return denied

    const { data } = await supabaseAdmin
      .from('avis')
      .select('*')
      .order('created_at', { ascending: false })
    return NextResponse.json(data ?? [])
  }

  const { data } = await supabaseAdmin
    .from('avis')
    .select('*')
    .eq('statut', 'approuve')
    .order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}
