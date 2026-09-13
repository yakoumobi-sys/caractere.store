import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'
import { requireAdmin } from '@/lib/api-auth'
import { commandeLimiter, getIP } from '@/lib/rate-limit'
import {
  validerCommande,
  projectionPublique,
  echapperHtml,
  normaliserTelephone,
  type CommandeValidee,
} from '@/lib/commande-validation'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

/**
 * Référence de commande.
 *
 * L'ancienne référence était `CAR-` + l'horodatage en base 36 : deux commandes
 * passées à la même minute avaient des références voisines, donc devinables.
 * Comme la référence sert aussi de clé de consultation, on la tire au sort
 * (40 bits), ce qui rend l'énumération inutilisable.
 */
function genererReference(): string {
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ' // sans I, L, O, U : pas d'ambiguïté à l'oral
  const octets = randomBytes(8)
  let suffixe = ''
  for (let i = 0; i < 8; i++) suffixe += alphabet[octets[i] % alphabet.length]
  return `CAR-${suffixe}`
}

/** Fenêtre pendant laquelle deux envois identiques sont considérés en double. */
const FENETRE_DOUBLON_MS = 10 * 60 * 1000

/**
 * Empreinte anti-doublon : même client, même pièce, même quantité, dans la
 * même tranche de dix minutes. Un double clic ou un renvoi réseau retombe sur
 * la même empreinte, que l'index unique en base refuse d'insérer deux fois.
 */
function empreinteCommande(commande: CommandeValidee): string {
  const tranche = Math.floor(Date.now() / FENETRE_DOUBLON_MS)
  return createHash('sha256')
    .update(
      [
        commande.telephone,
        commande.produit_id,
        commande.quantite,
        JSON.stringify(commande.quantites_tailles),
        tranche,
      ].join('|'),
    )
    .digest('hex')
    .slice(0, 32)
}

export async function POST(req: NextRequest) {
  try {
    // ── Limitation des soumissions ────────────────────────────────
    const ip = getIP(req)
    const { success } = await commandeLimiter.limit(`commande:${ip}`)
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de commandes envoyées depuis cet appareil. Réessayez plus tard ou contactez-nous sur WhatsApp.' },
        { status: 429 },
      )
    }

    const brut = await req.json().catch(() => null)

    // ── Validation serveur ────────────────────────────────────────
    // Rien n'est inséré tel quel : seuls les champs ci-dessous existent, et
    // les prix sont recalculés depuis le catalogue, jamais repris du client.
    const resultat = validerCommande(brut)
    if (!resultat.ok) {
      return NextResponse.json(
        { error: resultat.erreurs[0], erreurs: resultat.erreurs },
        { status: 400 },
      )
    }
    const { commande } = resultat
    const empreinte = empreinteCommande(commande)

    // ── Protection contre les doublons ────────────────────────────
    // L'index unique sur `empreinte` tranche la course entre deux requêtes
    // simultanées ; cette lecture évite de renvoyer une erreur à l'utilisateur
    // quand il a simplement cliqué deux fois.
    const { data: existante } = await supabaseAdmin
      .from('commandes')
      .select('reference')
      .eq('empreinte', empreinte)
      .maybeSingle()

    if (existante?.reference) {
      return NextResponse.json({ success: true, reference: existante.reference, doublon: true })
    }

    const reference = genererReference()
    const { data, error } = await supabaseAdmin
      .from('commandes')
      .insert([
        {
          // Liste explicite : le navigateur ne peut plus écrire une colonne
          // qu'on n'a pas prévue (à commencer par `statut` et les prix).
          reference,
          statut: 'nouveau',
          produit: commande.produit,
          produit_id: commande.produit_id,
          couleur: commande.couleur,
          tailles: commande.tailles,
          quantites_tailles: commande.quantites_tailles,
          quantite: commande.quantite,
          technique: commande.technique,
          position: commande.position,
          urgent: commande.urgent,
          nom_client: commande.nom_client,
          entreprise: commande.entreprise,
          telephone: commande.telephone,
          email: commande.email,
          notes: commande.notes,
          wilaya: commande.wilaya,
          commune: commande.commune,
          adresse: commande.adresse,
          logo_url: commande.logo_url,
          canal: commande.canal,
          prix_unitaire: commande.prix_unitaire,
          prix_total: commande.prix_total,
          empreinte,
        },
      ])
      .select()
      .single()

    if (error) {
      // Course perdue sur l'index unique : la commande de l'autre requête fait
      // foi, on renvoie sa référence plutôt qu'une erreur.
      if (error.code === '23505') {
        const { data: gagnante } = await supabaseAdmin
          .from('commandes')
          .select('reference')
          .eq('empreinte', empreinte)
          .maybeSingle()
        if (gagnante?.reference) {
          return NextResponse.json({ success: true, reference: gagnante.reference, doublon: true })
        }
      }
      throw error
    }

    // Fait entrer la commande dans la file de confirmation de l'ERP
    // (Caractère ERP, projet Supabase séparé). Ne doit jamais faire échouer
    // la commande côté client si l'ERP est indisponible.
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
          // Sujet et corps échappés : un nom ou une note contenant du HTML ne
          // peut plus se glisser dans l'email envoyé à l'atelier.
          subject: `Nouvelle commande ${reference} - ${commande.produit}`.slice(0, 180),
          html: emailCommande(reference, commande),
        })
      } catch (emailError) {
        console.error('Email send error:', emailError)
      }
    }

    return NextResponse.json({ success: true, reference })
  } catch (err) {
    console.error('Commande error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

function emailCommande(reference: string, commande: CommandeValidee): string {
  const e = echapperHtml
  const montant = commande.tarif_chiffre
    ? `${commande.prix_total.toLocaleString('fr-FR')} DA (hors livraison)`
    : 'Sur devis — tarif non publie pour cette piece'

  const repartition = Object.entries(commande.quantites_tailles)
    .map(([taille, n]) => `${e(taille)} x ${e(n)}`)
    .join(', ')

  const lignes: [string, string][] = [
    ['Produit', `${e(commande.produit)} (${e(commande.produit_id)})`],
    ['Couleur', e(commande.couleur)],
    ['Repartition', repartition || '-'],
    ['Quantite totale', e(commande.quantite)],
    ['Technique', e(commande.technique)],
    ['Emplacement', e(commande.position)],
    ['Urgent', commande.urgent ? 'Oui' : 'Non'],
    ['SEP', 'SEP'],
    ['Client', e(commande.nom_client)],
    ['Entreprise', e(commande.entreprise ?? '-')],
    ['Telephone', e(commande.telephone)],
    ['Email', e(commande.email ?? '-')],
    ['Livraison', e([commande.wilaya, commande.commune, commande.adresse].filter(Boolean).join(' - '))],
    ['SEP', 'SEP'],
    ['Prix unitaire', commande.tarif_chiffre ? `${commande.prix_unitaire.toLocaleString('fr-FR')} DA` : '-'],
    ['Sous-total vetements', montant],
    ['Frais de livraison', 'A confirmer avec le client'],
  ]

  const corps = lignes
    .map(([cle, valeur]) =>
      cle === 'SEP'
        ? '<tr><td colspan="2" style="padding:6px 0;border-bottom:1px solid #e0e0e0"></td></tr>'
        : `<tr>
             <td style="padding:8px 0;color:#6e6e73;font-size:13px;border-bottom:1px solid #f0f0f0;width:42%">${cle}</td>
             <td style="padding:8px 0;font-size:13px;font-weight:500;border-bottom:1px solid #f0f0f0">${valeur}</td>
           </tr>`,
    )
    .join('')

  const admin = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.caracteredz.com'}/admin/commandes`

  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px">
      <h2 style="font-size:24px;font-weight:700;margin-bottom:24px;color:#1d1d1f">Nouvelle commande</h2>
      <div style="background:#f5f5f7;border-radius:12px;padding:24px;margin-bottom:24px">
        <p style="font-size:22px;font-weight:700;margin:0;color:#1d1d1f">Ref. ${e(reference)}</p>
      </div>
      <table style="width:100%;border-collapse:collapse">${corps}</table>
      ${commande.notes ? `<div style="margin-top:16px;background:#fff9c4;border-radius:8px;padding:12px"><strong>Notes :</strong> ${e(commande.notes)}</div>` : ''}
      ${commande.logo_url ? `<p style="margin-top:16px;font-size:13px"><a href="${e(commande.logo_url)}">Telecharger le logo</a></p>` : ''}
      <div style="margin-top:32px;text-align:center">
        <a href="${e(admin)}" style="background:#1d1d1f;color:#fff;padding:12px 24px;border-radius:980px;text-decoration:none;font-size:14px;font-weight:500">Voir dans l'admin</a>
      </div>
    </div>
  `
}

/**
 * Lecture d'une commande.
 *
 * Avant, `?reference=...` renvoyait la ligne complète : nom, téléphone, email
 * et adresse du client étaient accessibles à qui connaissait — ou devinait —
 * une référence. Trois niveaux désormais :
 *
 *  - admin authentifié    → tout, et la liste complète ;
 *  - référence + téléphone → tout, pour le client qui prouve que c'est la
 *                            sienne (le numéro n'est jamais renvoyé, seulement
 *                            comparé) ;
 *  - référence seule       → suivi uniquement, sans aucune donnée personnelle.
 */
export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference')
  const telephone = req.nextUrl.searchParams.get('telephone')

  if (reference) {
    // Une référence n'est pas un secret solide : on borne aussi les lectures
    // pour qu'un balayage ne soit pas praticable.
    const { success } = await commandeLimiter.limit(`suivi:${getIP(req)}`)
    if (!success) {
      return NextResponse.json({ error: 'Trop de requêtes.' }, { status: 429 })
    }

    const { data, error } = await supabaseAdmin
      .from('commandes')
      .select('*')
      .eq('reference', reference)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
    }

    const estAdmin = (await requireAdmin(req)) === null
    if (estAdmin) return NextResponse.json(data)

    if (telephone) {
      const fourni = normaliserTelephone(telephone).replace(/\D/g, '')
      const enregistre = String(data.telephone ?? '').replace(/\D/g, '')
      // Comparaison sur les 9 derniers chiffres : le client peut saisir son
      // numéro avec ou sans indicatif.
      const correspond =
        fourni.length >= 9 && enregistre.length >= 9 && fourni.slice(-9) === enregistre.slice(-9)
      if (correspond) return NextResponse.json(data)
      return NextResponse.json({ error: 'Numéro de téléphone non reconnu' }, { status: 403 })
    }

    return NextResponse.json(projectionPublique(data))
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
