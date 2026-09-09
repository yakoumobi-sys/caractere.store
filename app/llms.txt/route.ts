import { SECTEURS, PRODUITS_B2B, PALIERS, FAQ_ENTREPRISES } from '@/lib/entreprises-data'
import { SITE_URL, PHONE_DISPLAY, WHATSAPP, EMAIL, INSTAGRAM } from '@/lib/seo'

// /llms.txt — convention de fait pour les moteurs de réponse IA (ChatGPT,
// Claude, Perplexity, Gemini) : un résumé en texte brut, sans balisage ni
// JavaScript, qu'un modèle peut lire et citer directement. Généré depuis
// lib/entreprises-data.ts pour ne jamais diverger des pages HTML.
export const dynamic = 'force-static'

function body() {
  return `# Caractère Store

> Atelier de personnalisation textile basé à Alger (Algérie). Broderie machine,
> impression DTF et sérigraphie sur uniformes d'entreprise, vêtements de travail
> et goodies. Aucun minimum de commande, devis chiffré sous 2 heures, production
> en 3 à 5 jours ouvrés, livraison dans les 58 wilayas d'Algérie.

Site : ${SITE_URL}
Contact : WhatsApp ${PHONE_DISPLAY} (${WHATSAPP}) · ${EMAIL} · ${INSTAGRAM}
Localisation : Alger, Algérie — livraison nationale
Langues : français, arabe
Devise : dinar algérien (DA / DZD)

## Offre entreprises (B2B)

Page principale : ${SITE_URL}/entreprises

Services :
- Broderie machine — polos, casquettes, blouses, gilets. Résiste au lavage à 60 °C.
- Impression DTF — t-shirts, totebags, visuels multicolores et photographiques.
- Sérigraphie — grandes séries, logos de 1 à 3 couleurs, coût unitaire le plus bas.
- Vectorisation du logo offerte pour toute commande (JPG/PNG accepté).

Prix unitaires publics (personnalisation comprise) :
${PRODUITS_B2B.map(p => `- ${p.nom} personnalisé : à partir de ${p.prix.toLocaleString('fr-FR')} DA — ${p.detail}`).join('\n')}

Remises par volume :
${PALIERS.map(p => `- ${p.volume} : ${p.remise} (${p.detail})`).join('\n')}

Délais : 3 à 5 jours ouvrés en standard, option urgente 48h sur demande.
Paiement : à la livraison, BaridiMob, CCP.

## Secteurs équipés

${SECTEURS.map(s => `- ${s.nom} : ${s.description} → ${SITE_URL}/entreprises/${s.slug}`).join('\n')}

## Questions fréquentes

${FAQ_ENTREPRISES.map(f => `Q : ${f.q}\nR : ${f.r}`).join('\n\n')}

## Autres pages

- Accueil : ${SITE_URL}/
- Créateurs et particuliers : ${SITE_URL}/particuliers
- Print on demand : ${SITE_URL}/print-on-demand
- Devis express : ${SITE_URL}/devis-express
- Catalogue produits : ${SITE_URL}/produits
- Comment ça marche : ${SITE_URL}/comment-ca-marche
- Avis clients : ${SITE_URL}/avis
- Mentions légales et CGV : ${SITE_URL}/mentions-legales
`
}

export function GET() {
  return new Response(body(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
