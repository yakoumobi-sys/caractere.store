// app/api/admin/marketing/email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { requireAdmin } from '@/lib/api-auth'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

interface EmailContact {
  nom: string
  email: string
}

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

// Valide une adresse email basiquement
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email marketing non configuré — ajoutez RESEND_API_KEY dans les variables d'environnement." },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const { contacts, subject, message } = body as {
      contacts: EmailContact[]
      subject: string
      message: string
    }

    // Validation stricte
    if (!subject?.trim() || subject.trim().length > 200) {
      return NextResponse.json({ error: 'Sujet invalide (max 200 caractères).' }, { status: 400 })
    }

    if (!message?.trim() || message.trim().length > 5000) {
      return NextResponse.json({ error: 'Message invalide (max 5000 caractères).' }, { status: 400 })
    }

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ error: 'Aucun contact fourni.' }, { status: 400 })
    }

    const recipients = contacts.filter(c =>
      c.email && isValidEmail(c.email)
    ).slice(0, 5000) // Max 5000 destinataires

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'Aucun destinataire valide.' }, { status: 400 })
    }

    const resend = getResend()
    const escapedSubject = escapeHtml(subject.trim())
    const escapedMessage = escapeHtml(message.trim())

    const results = await Promise.allSettled(
      recipients.map(c => {
        const prenom = escapeHtml((c.nom?.split(' ')[0] || 'Client').slice(0, 50))
        // Remplace {{NOM}} mais avec du texte échappé
        const personalized = escapedMessage.replace(/{{NOM}}/g, prenom)
        return resend.emails.send({
          from: 'Caractère Store <contact@caracterestore.dz>',
          to: c.email,
          subject: escapedSubject,
          html: `<div style="font-family:sans-serif;white-space:pre-wrap;word-break:break-word;">${personalized}</div>`,
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
    console.error('Erreur sur /api/admin/marketing/email:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
