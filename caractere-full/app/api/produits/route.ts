import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/produits
export async function GET() {
  const { data } = await supabaseAdmin.from('produits').select('*').order('ordre')
  return NextResponse.json(data)
}

// POST /api/produits
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await supabaseAdmin.from('produits').insert([body]).select().single()
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(data)
}
