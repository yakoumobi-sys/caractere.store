import { createHmac, timingSafeEqual } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const runtime = 'nodejs'
export const maxDuration = 60

// A separate, forwarding-only Resend inbox. Do not change the existing MX for caracteredz.com.
const INBOX_ID = '3670d599-8722-4a29-91a7-764ca0d76157'
const FROM = 'Caractère <contact@caracteredz.com>'
const MAX_LOGO_BYTES = 4 * 1024 * 1024

type IncomingEvent = {
  type?: string
  data?: {
    inbox_id?: string
    email_id?: string
    inbound_email_id?: string
    thread_id?: string
  }
}
type ReceivedMail = {
  from?: string
  subject?: string
  text?: string
  message_id?: string
}
type Attachment = {
  id?: string
  filename?: string
  content_type?: string
  size?: number
  download_url?: string
}

function verifySignature(request: NextRequest, payload: string, secret: string): boolean {
  const id = request.headers.get('svix-id')
  const timestamp = request.headers.get('svix-timestamp')
  const signatures = request.headers.get('svix-signature')
  if (!id || !timestamp || !signatures || !/^\\d{10}$/.test(timestamp)) return false
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > 300) return false
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  if (key.length < 16) return false
  const signed = id + '.' + timestamp + '.' + payload
  const digest = createHmac('sha256', key).update(signed).digest('base64')
  const target = Buffer.from(digest)
  return signatures.split(' ').some((entry) => {
    if (!entry.startsWith('v1,')) return false
    const candidate = Buffer.from(entry.slice(3))
    return candidate.length === target.length && timingSafeEqual(candidate, target)
  })
}

function emailAddress(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const match = value.match(/(?:^|<)([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,})(?:>|$)/i)
  const email = match?.[1]?.toLowerCase() ?? null
  if (!email || email.length > 254 || email.endsWith('@caracteredz.com')) return null
  return email
}

function choice(subject: string, body: string) {
  const text = (subject + ' ' + body.slice(0, 800)).toLocaleLowerCase('fr')
  if (/hoodie|sweat|capuche/.test(text)) return { name: 'hoodie', file: 'hoodie.png', label: 'Hoodie Caractère' }
  if (/t.?shirt|tee.?shirt/.test(text)) return { name: 'tshirt', file: 'tshirt-oversized.png', label: 'T-shirt Caractère' }
  // For gilets, tabliers, casquettes and PDFs, an employee must verify the right product template.
  if (/gilet|tablier|casquette|combinaison|veste|sac|tote/.test(text)) return null
  return { name: 'polo', file: 'polo.png', label: 'Polo Caractère' }
}

function imageType(buffer: Buffer): 'image/png' | 'image/jpeg' | null {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) return 'image/png'
  if (buffer.length >= 3 && buffer.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex'))) return 'image/jpeg'
  return null
}

async function apiGet<T>(path: string, key: string): Promise<T> {
  const response = await fetch('https://api.resend.com' + path, {
    headers: { Authorization: 'Bearer ' + key },
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('Resend lookup returned ' + response.status)
  return await response.json() as T
}

async function generatePreview(logo: Buffer, mime: string, filename: string, label: string): Promise<Buffer> {
  const product = await readFile(join(process.cwd(), 'public', 'home-cutouts', filename))
  const garmentData = 'data:image/png;base64,' + product.toString('base64')
  const logoData = 'data:' + mime + ';base64,' + logo.toString('base64')
  const image = new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#F7F7F8', fontFamily: 'Arial', color: '#111827', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 44px', backgroundColor: '#101214', color: '#ffffff' }}>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>CARACTÈRE</div>
        <div style={{ display: 'flex', fontSize: 16 }}>VOTRE LOGO MÉRITE DU CARACTÈRE</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 620, gap: 42 }}>
        <div style={{ display: 'flex', position: 'relative', width: 530, height: 590 }}>
          <img src={garmentData} alt="Vêtement Caractère" style={{ width: 530, height: 590, objectFit: 'contain' }} />
          <img src={logoData} alt="Logo reçu" style={{ position: 'absolute', left: 320, top: 192, width: 78, height: 78, objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, width: 310 }}>
          <div style={{ display: 'flex', fontSize: 18, color: '#555555' }}>APERÇU PERSONNALISÉ</div>
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 700 }}>{label}</div>
          <div style={{ display: 'flex', fontSize: 19 }}>Voici une première proposition avec votre logo.</div>
          <div style={{ display: 'flex', fontSize: 15, color: '#666666' }}>Visuel indicatif : dimensions, couleurs et placement à valider avant production.</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', padding: '22px 44px', fontSize: 17, color: '#404040', backgroundColor: '#EDEEF0' }}>
        <div style={{ display: 'flex' }}>SIMULATION GRATUITE · SANS ENGAGEMENT</div>
        <div style={{ display: 'flex' }}>caracteredz.com</div>
      </div>
    </div>,
    { width: 1100, height: 820 }
  )
  return Buffer.from(await image.arrayBuffer())
}

export async function POST(request: NextRequest) {
  const key = process.env.RESEND_API_KEY
  const secret = process.env.CARACTERE_LOGO_WEBHOOK_SECRET
  const enabled = process.env.CARACTERE_AUTO_SIMULATION_ENABLED === 'true'
  if (!key || !secret) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  const payload = await request.text()
  if (payload.length > 200_000 || !verifySignature(request, payload, secret)) {
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 401 })
  }

  let event: IncomingEvent
  try { event = JSON.parse(payload) as IncomingEvent }
  catch { return NextResponse.json({ error: 'Bad payload' }, { status: 400 }) }

  if (event.type !== 'inbox.email.received' || event.data?.inbox_id !== INBOX_ID) {
    return NextResponse.json({ ignored: true })
  }
  // No automatic replies until a verified end-to-end test and explicit enablement.
  if (!enabled) return NextResponse.json({ disabled: true })

  const { inbound_email_id: inboundId, email_id: emailId } = event.data
  if (!inboundId || !emailId || !/^[a-z0-9-]{12,}$/i.test(inboundId)) {
    return NextResponse.json({ ignored: 'missing inbound identifiers' })
  }
  const redis = Redis.fromEnv()
  const lock = 'caractere:mail-simulation:' + inboundId
  const acquired = await redis.set(lock, 'processing', { nx: true, ex: 900 })
  if (acquired !== 'OK') return NextResponse.json({ duplicate: true })

  try {
    const email = await apiGet<ReceivedMail>('/emails/receiving/' + encodeURIComponent(inboundId), key)
    const sender = emailAddress(email.from)
    if (!sender) return NextResponse.json({ ignored: 'invalid sender' })
    const subject = (email.subject || '').slice(0, 200)
    const body = (email.text || '').slice(0, 1000)
    if (!/logo|simulation|polo|t.?shirt|tenue|personnalisation/i.test(subject + ' ' + body)) {
      return NextResponse.json({ ignored: 'not a logo request' })
    }
    const product = choice(subject, body)
    if (!product) return NextResponse.json({ ignored: 'manual product template required' })

    const list = await apiGet<{ data?: Attachment[] }>(
      '/emails/receiving/' + encodeURIComponent(inboundId) + '/attachments?limit=15', key
    )
    const attachments = (list.data || []).filter(a =>
      a.filename && /\\.(png|jpe?g)$/i.test(a.filename) &&
      a.size && a.size > 0 && a.size <= MAX_LOGO_BYTES &&
      (a.content_type === 'image/png' || a.content_type === 'image/jpeg') &&
      a.download_url && a.download_url.startsWith('https://')
    )
    // Multiple unrelated images are ambiguous: skip rather than placing a signature image as the logo.
    const withLogoName = attachments.filter(a => /logo|embleme|marque|brand/i.test(a.filename || ''))
    const chosen = withLogoName.length === 1 ? withLogoName[0] : attachments.length === 1 ? attachments[0] : null
    if (!chosen || !chosen.download_url) return NextResponse.json({ ignored: 'missing or ambiguous logo' })

    const perSender = 'caractere:mail-simulation:daily:' + sender + ':' + new Date().toISOString().slice(0, 10)
    const count = await redis.incr(perSender)
    if (count === 1) await redis.expire(perSender, 86400)
    if (count > 1) return NextResponse.json({ ignored: 'daily sender cap' })
    const download = await fetch(chosen.download_url, { redirect: 'follow' })
    if (!download.ok || Number(download.headers.get('content-length') || '0') > MAX_LOGO_BYTES) throw new Error('Attachment download failed or exceeded size')
    const bytes = Buffer.from(await download.arrayBuffer())
    const mime = imageType(bytes)
    if (!mime || bytes.length > MAX_LOGO_BYTES) return NextResponse.json({ ignored: 'invalid image data' })

    const preview = await generatePreview(bytes, mime, product.file, product.label)
    const idempotency = 'caractere-logo-' + inboundId
    const replySubject = subject.toLowerCase().startsWith('re:') ? subject : 'Re: ' + subject
    const text = 'Bonjour,\\n\\nMerci pour votre logo ! Vous trouverez ci-joint votre première simulation sur ' + product.label.toLowerCase() + '.\\n\\nCeci est un aperçu indicatif : nous pouvons ajuster le rendu avant production.\\n\\nPour recevoir votre devis, répondez avec la quantité souhaitée, la couleur et vos préférences de marquage.\\n\\nCaractère — Aïn Benian, Alger\\nhttps://www.caracteredz.com/simulation'
    const headers: Record<string, string> = {}
    if (email.message_id && /^<[^\\r\\n<>]+>$/.test(email.message_id)) {
      headers['In-Reply-To'] = email.message_id
      headers['References'] = email.message_id
    }
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotency,
      },
      body: JSON.stringify({
        from: FROM, to: [sender], reply_to: 'contact@caracteredz.com',
        subject: replySubject, text, headers,
        attachments: [{ filename: 'Simulation-Caractere.png', content: preview.toString('base64') }],
      }),
    })
    if (!sent.ok) throw new Error('Reply delivery failed with status ' + sent.status)
    await redis.set(lock, 'sent', { ex: 86400 * 30 })
    return NextResponse.json({ sent: true })
  } catch (error) {
    // The original email is untrusted; never log its contents, address or attachment.
    console.error('Logo simulation failed', error instanceof Error ? error.message : 'Unexpected error')
    await redis.del(lock)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
