import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { data, error } = await supabaseAdmin.from('produits').update(body).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabaseAdmin.from('produits').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json({ success: true })
}
