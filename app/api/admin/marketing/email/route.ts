// app/api/admin/marketing/email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { requireAdmin } from '@/lib/api-auth'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

interface EmailContact {
  nom: string
  email: string
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

  const { contacts, subject, message } = await req.json() as {
    contacts: EmailContact[]
    subject: string
    message: string
  }

  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Sujet et message requis.' }, { status: 400 })
  }

  const recipients = (contacts || []).filter(c => c.email)
  if (recipients.length === 0) {
    return NextResponse.json({ error: 'Aucun destinataire avec email.' }, { status: 400 })
  }

  const resend = getResend()
  const results = await Promise.allSettled(
    recipients.map(c => {
      const prenom = c.nom?.split(' ')[0] || 'Client'
      const personalized = message.replace(/{{NOM}}/g, prenom)
      return resend.emails.send({
        from: 'Caractère Store <contact@caracterestore.dz>',
        to: c.email,
        subject,
        html: `<div style="font-family:sans-serif;white-space:pre-wrap;">${personalized}</div>`,
      })
    })
  )

  const sent = results.filter(r => r.status === 'fulfilled').length
  const failed = results.length - sent
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => String(r.reason?.message || r.reason))

  return NextResponse.json({ sent, failed, errors })
}
