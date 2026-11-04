import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'
import { requireAdmin } from '@/lib/api-auth'
import { applyB2BPricing } from '@/lib/b2b-catalogue'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(req: NextRequest) {
  try {
    const input = await req.json()
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return NextResponse.json({ error: 'Commande invalide' }, { status: 400 })
    }
    // Un id client, un statut ou une validation de paiement venant du navigateur
    // ne peuvent jamais être utilisés pour attribuer des points.
    const { user_id: _ignored, statut: _status, paid_confirmed_at: _paid, ...orderInput } = input
    let body: typeof orderInput
    try {
      body = applyB2BPricing(orderInput)
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : 'Commande invalide' }, { status: 400 })
    }

    // Associe seulement les achats à une identité authentifiée auprès de Supabase.
    // Les commandes invitées restent possibles sans lien de fidélité.
    let verifiedUserId: string | null = null
    try {
      const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim()
      if (token) {
        const { data } = await supabaseAdmin.auth.getUser(token)
        verifiedUserId = data.user?.id || null
      } else if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const auth = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          { cookies: {
            get(name: string) { return req.cookies.get(name)?.value },
            set() {},
            remove() {},
          } }
        )
        const { data } = await auth.auth.getUser()
        verifiedUserId = data.user?.id || null
      }
    } catch { verifiedUserId = null }

    const { data, error } = await supabaseAdmin
      .from('commandes')
      .insert([{ ...body, user_id: verifiedUserId, statut: 'nouveau', paid_confirmed_at: null }])
      .select()
      .single()

    if (error) throw error

    // Fait entrer la commande dans la file de confirmation de l'ERP
    // (Caractère ERP, projet Supabase séparé). Ne doit jamais faire
    // échouer la commande côté client si l'ERP est indisponible.
    if (process.env.ERP_WEBHOOK_URL && process.env.SITE_ORDERS_WEBHOOK_SECRET) {
      try {
        await fetch(`${process.env.ERP_WEBHOOK_URL}/api/webhooks/site-orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-webhook-secret': process.env.SITE_ORDERS_WEBHOOK_SECRET,
          },
          body: JSON.stringify(data),
        })
      } catch (webhookError) {
        console.error('ERP webhook error:', webhookError)
      }
    }

    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        await getResend().emails.send({
          from: 'Caractere Store <onboarding@resend.dev>',
          to: process.env.ADMIN_EMAIL,
          subject: `Nouvelle commande ${body.reference} - ${body.produit}`,
          html: `
            <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px">
              <h2 style="font-size:24px;font-weight:700;margin-bottom:24px;color:#1d1d1f">Nouvelle commande recue</h2>
              <div style="background:#f5f5f7;border-radius:12px;padding:24px;margin-bottom:24px">
                <p style="font-size:22px;font-weight:700;margin:0;color:#1d1d1f">Ref. ${body.reference}</p>
              </div>
              <table style="width:100%;border-collapse:collapse">
                ${[
                  ['Produit', body.produit],
                  ['Quantite', `${body.quantite} pieces`],
                  ['Couleur', body.couleur],
                  ['Tailles', (body.tailles || []).join(', ')],
                  ['Emplacement', body.position],
                  ['Technique', body.technique],
                  ['Urgent', body.urgent ? 'Oui' : 'Non'],
                  ['---','---'],
                  ['Client', body.nom_client],
                  ['Entreprise', body.entreprise || '-'],
                  ['Telephone', body.telephone],
                  ['Email', body.email || '-'],
                  ['---','---'],
                  ['Prix unitaire', `${body.prix_unitaire?.toLocaleString('fr-FR')} DA`],
                  ['Total estime', `${body.prix_total?.toLocaleString('fr-FR')} DA`],
                ].map(([k,v]) => v === '---' ? '<tr><td colspan="2" style="padding:6px 0;border-bottom:1px solid #e0e0e0"></td></tr>' : `
                  <tr>
                    <td style="padding:8px 0;color:#6e6e73;font-size:13px;border-bottom:1px solid #f0f0f0;width:40%">${k}</td>
                    <td style="padding:8px 0;font-size:13px;font-weight:500;border-bottom:1px solid #f0f0f0">${v}</td>
                  </tr>
                `).join('')}
              </table>
              ${body.notes ? `<div style="margin-top:16px;background:#fff9c4;border-radius:8px;padding:12px"><strong>Notes :</strong> ${body.notes}</div>` : ''}
              <div style="margin-top:32px;text-align:center">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caractere-store-phi.vercel.app'}/admin/commandes" style="background:#1d1d1f;color:#fff;padding:12px 24px;border-radius:980px;text-decoration:none;font-size:14px;font-weight:500">Voir dans l'admin</a>
              </div>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Email send error:', emailError)
      }
    }

    return NextResponse.json({ success: true, reference: body.reference })
  } catch (err) {
    console.error('Commande error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference')

  if (reference) {
    const { data, error } = await supabaseAdmin
      .from('commandes')
      .select('reference,statut,produit,quantite,couleur,technique,prix_total')
      .eq('reference', reference)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
    }

    // Le suivi public par référence ne révèle ni contacts ni adresses.
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
  }

  // Liste complète : réservée à l'admin
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { data } = await supabaseAdmin
    .from('commandes')
    .select('*')
    .order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}
