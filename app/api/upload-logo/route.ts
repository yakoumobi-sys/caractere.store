import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const MAX_BYTES = 4 * 1024 * 1024
const ALLOWED = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
  ['application/pdf', 'pdf'],
])

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const value = formData.get('file')
    if (!(value instanceof File)) return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
    if (!value.size || value.size > MAX_BYTES) return NextResponse.json({ error: 'Fichier trop lourd (4 Mo maximum)' }, { status: 413 })
    const ext = ALLOWED.get(value.type)
    if (!ext) return NextResponse.json({ error: 'Format accepté : PNG, JPG, WEBP ou PDF' }, { status: 415 })
    const originalExt = value.name.split('.').pop()?.toLowerCase()
    if (originalExt !== ext && !(ext === 'jpg' && originalExt === 'jpeg')) return NextResponse.json({ error: 'Extension de fichier invalide' }, { status: 415 })

    const fileName = `logos/${crypto.randomUUID()}.${ext}`
    const buffer = Buffer.from(await value.arrayBuffer())
    const { error } = await supabaseAdmin.storage.from('image').upload(fileName, buffer, {
      contentType: value.type,
      upsert: false,
      cacheControl: '3600',
    })
    if (error) throw error

    const { data: urlData } = supabaseAdmin.storage.from('image').getPublicUrl(fileName)
    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload impossible' }, { status: 503 })
  }
}
