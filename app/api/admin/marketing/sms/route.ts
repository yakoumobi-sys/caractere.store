// app/api/admin/marketing/sms/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { marketingLimiter, getIP } from '@/lib/rate-limit'

interface SmsContact {
  nom: string
  telephone: string
}

// Même logique de normalisation que wa() dans app/admin/marketing/page.tsx,
// mais au format E.164 (+213...) attendu par Twilio.
function toE164(phone: string) {
  const clean = phone.replace(/\D/g, '')
  const num = clean.startsWith('0') ? '213' + clean.slice(1) : clean.startsWith('213') ? clean : '213' + clean
  return `+${num}`
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  // Rate limiting: max 10 campagnes par jour
  const ip = getIP(req)
  const { success } = await marketingLimiter.limit(`sms:${ip}`)
  if (!success) {
    return NextResponse.json(
      { error: 'Limite de campagnes SMS atteinte (max 10/jour).' },
      { status: 429 }
    )
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    return NextResponse.json(
      { error: 'SMS marketing non configuré — ajoutez TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN et TWILIO_FROM_NUMBER dans les variables d\'environnement.' },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const { contacts, message } = body as {
      contacts: SmsContact[]
      message: string
    }

    // Validation stricte
    if (!message?.trim() || message.trim().length > 160) {
      return NextResponse.json({ error: 'Message invalide (max 160 caractères pour SMS).' }, { status: 400 })
    }

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ error: 'Aucun contact fourni.' }, { status: 400 })
    }

    const recipients = (contacts || [])
      .filter(c => c.telephone && typeof c.telephone === 'string')
      .slice(0, 1000) // Max 1000 SMS par campagne

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'Aucun destinataire valide.' }, { status: 400 })
    }

    // Import paresseux : évite de charger le SDK Twilio (et de résoudre les
    // credentials) sur les requêtes qui n'atteignent jamais ce point.
    const twilio = (await import('twilio')).default
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    const trimmedMessage = message.trim()
    const results = await Promise.allSettled(
      recipients.map(c => {
        const prenom = (c.nom?.split(' ')[0] || 'Client').slice(0, 50)
        const personalized = trimmedMessage.replace(/{{NOM}}/g, prenom)
        return client.messages.create({
          from: TWILIO_FROM_NUMBER,
          to: toE164(c.telephone),
          body: personalized,
        })
      })
    )

    const sent = results.filter(r => r.status === 'fulfilled').length
    const failed = results.length - sent
    const errors = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map(r => String(r.reason?.message || r.reason).slice(0, 200))

    return NextResponse.json({ sent, failed, errors })
  } catch (error) {
    console.error('Erreur sur /api/admin/marketing/sms:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
