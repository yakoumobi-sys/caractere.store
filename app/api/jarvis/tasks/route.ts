import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/api-auth'

// GET /api/jarvis/tasks — données personnelles, protégées même en lecture
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  const { data, error } = await supabaseAdmin
    .from('jarvis_tasks')
    .select('*')
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(data)
}

// POST /api/jarvis/tasks
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  const body = await req.json()
  const { data, error } = await supabaseAdmin.from('jarvis_tasks').insert([body]).select().single()
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(data)
}
