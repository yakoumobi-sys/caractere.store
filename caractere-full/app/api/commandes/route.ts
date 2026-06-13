import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Sauvegarder dans Supabase
    const { data, error } = await supabaseAdmin
      .from('commandes')
      .insert([{ ...body, statut: 'nouveau' }])
      .select()
      .single()

    if (error) throw error

    // Envoyer email de notification
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from: 'Caractère Store <commandes@caracterestore.dz>',
        to: process.env.ADMIN_EMAIL,
        subject: `🛍️ Nouvelle commande ${body.reference} — ${body.produit}`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px">
            <h2 style="font-size:24px;font-weight:700;margin-bottom:24px;color:#1d1d1f">Nouvelle commande reçue</h2>
            <div style="background:#f5f5f7;border-radius:12px;padding:24px;margin-bottom:24px">
              <p style="font-size:22px;font-weight:700;margin:0;color:#1d1d1f">Réf. ${body.reference}</p>
            </div>
            <table style="width:100%;border-collapse:collapse">
              ${[
                ['Produit', body.produit],
                ['Quantité', `${body.quantite} pièces`],
                ['Couleur', body.couleur],
                ['Tailles', (body.tailles || []).join(', ')],
                ['Emplacement', body.position],
                ['Technique', body.technique],
                ['Urgent', body.urgent ? 'Oui ⚡' : 'Non'],
                ['---','---'],
                ['Client', body.nom_client],
                ['Entreprise', body.entreprise || '—'],
                ['Téléphone', body.telephone],
                ['Email', body.email || '—'],
                ['---','---'],
                ['Prix unitaire', `${body.prix_unitaire?.toLocaleString('fr-FR')} DA`],
                ['Total estimé', `${body.prix_total?.toLocaleString('fr-FR')} DA`],
              ].map(([k,v]) => v === '---' ? '<tr><td colspan="2" style="padding:6px 0;border-bottom:1px solid #e0e0e0"></td></tr>' : `
                <tr>
                  <td style="padding:8px 0;color:#6e6e73;font-size:13px;border-bottom:1px solid #f0f0f0;width:40%">${k}</td>
                  <td style="padding:8px 0;font-size:13px;font-weight:500;border-bottom:1px solid #f0f0f0">${v}</td>
                </tr>
              `).join('')}
            </table>
            ${body.notes ? `<div style="margin-top:16px;background:#fff9c4;border-radius:8px;padding:12px"><strong>Notes :</strong> ${body.notes}</div>` : ''}
            <div style="margin-top:32px;text-align:center">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/commandes" style="background:#1d1d1f;color:#fff;padding:12px 24px;border-radius:980px;text-decoration:none;font-size:14px;font-weight:500">Voir dans l'admin →</a>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true, reference: body.reference })
  } catch (err) {
    console.error('Commande error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  const { data } = await supabaseAdmin
    .from('commandes')
    .select('*')
    .order('created_at', { ascending: false })
  return NextResponse.json(data)
}
