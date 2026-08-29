import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { publicApiLimiter, getIP } from '@/lib/rate-limit'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

// Échappe les caractères HTML dangereux
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, char => map[char])
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: max 5 requêtes par heure par IP
    const ip = getIP(req)
    const { success } = await publicApiLimiter.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de demandes. Réessayez dans 1 heure.' },
        { status: 429 }
      )
    }

    const body = await req.json()

    // Validation basique de la requête
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
    }

    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      const nomClient = escapeHtml(String(body.nom ?? 'Inconnu').slice(0, 100))
      const htmlContent = escapeHtml(JSON.stringify(body, null, 2))

      await getResend().emails.send({
        from: 'Caractère Store <contact@caracterestore.dz>',
        to: process.env.ADMIN_EMAIL,
        subject: `📩 Demande de devis — ${nomClient}`,
        html: `<pre style="font-family:monospace;white-space:pre-wrap;word-break:break-word">${htmlContent}</pre>`,
      })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur sur /api/contact:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
