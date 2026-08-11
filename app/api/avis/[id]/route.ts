import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/api-auth'

// PATCH /api/avis/[id] — modération admin (approuver / rejeter)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const body = await req.json()
  if (!['approuve', 'rejete', 'en_attente'].includes(body.statut)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('avis')
    .update({ statut: body.statut })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(data)
}

// DELETE /api/avis/[id] — suppression admin
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { error } = await supabaseAdmin.from('avis').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json({ success: true })
}
