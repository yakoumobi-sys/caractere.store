import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
export async function POST(req: NextRequest) {
  const body = await req.json()
  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    await resend.emails.send({
      from: 'Caractère Store <contact@caracterestore.dz>',
      to: process.env.ADMIN_EMAIL,
      subject: `📩 Demande de devis — ${body.nom ?? 'Inconnu'}`,
      html: `<pre style="font-family:monospace">${JSON.stringify(body,null,2)}</pre>`,
    })
  }
  return NextResponse.json({ success: true })
}
