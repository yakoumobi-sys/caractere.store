import { PRODUITS_B2B, PALIERS, TECHNIQUES, SECTEURS } from '@/lib/entreprises-data'
import { SITE_URL, WHATSAPP } from '@/lib/seo'

// Public, read-only catalogue. Les prix sont indicatifs : aucune disponibilité
// de stock ou promesse de prix définitif n'est déduite d'un tarif public.
// Ce document n'est PAS un flux ACP certifié : une intégration marchande
// exige validation du schéma et admission au programme concerné.
export const revalidate = 3600

export function GET() {
  const catalog = {
    version: '1.0',
    language: 'fr-DZ',
    merchant: {
      name: 'Caractère Store',
      website: SITE_URL,
      country: 'DZ',
      currency: 'DZD',
      business_model: 'B2B, fabrication et personnalisation textile sur devis',
      location: 'Alger, Algérie',
      delivery_area: 'Algérie',
    },
    catalog_type: 'quote_based',
    last_verified_by_merchant: null,
    guidance: {
      prices: "Tarifs de départ publics, en dinars algériens, à confirmer selon quantité, modèle, technique, logo et disponibilité.",
      availability: "La disponibilité et le délai précis sont toujours confirmés au devis ; ne pas supposer qu'un article est en stock.",
      order_method: 'Demande de devis ou de simulation gratuite, puis validation par le client',
      contact_url: `${SITE_URL}/entreprises/commande`,
      whatsapp_url: WHATSAPP,
      terms_url: `${SITE_URL}/mentions-legales`,
    },
    products: PRODUITS_B2B.map((product) => ({
      id: product.nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      title: `${product.nom} personnalisé pour entreprise`,
      description: product.detail,
      price_from: product.prix,
      price_currency: 'DZD',
      price_type: 'indicative_starting_price',
      stock_status: 'to_be_confirmed',
      customization: ['broderie', 'DTF', 'sérigraphie selon produit et volume'],
      detail_url: `${SITE_URL}/entreprises`,
      quote_url: `${SITE_URL}/entreprises/commande`,
    })),
    volume_pricing: PALIERS,
    production_methods: TECHNIQUES.map((t) => ({ name: t.nom, ideal_for: t.ideal })),
    business_sectors: SECTEURS.map((s) => ({
      name: s.nom,
      url: `${SITE_URL}/entreprises/${s.slug}`,
    })),
  }
  return Response.json(catalog, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
