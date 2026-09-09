// Constantes et générateurs de données structurées (JSON-LD) partagés.
// Un seul endroit pour l'identité de l'entreprise : Google, Bing et les moteurs
// de réponse IA (ChatGPT, Claude, Gemini, Perplexity) doivent lire exactement
// les mêmes NAP (Name / Address / Phone) partout, sinon la confiance chute.

export const SITE_URL = 'https://www.caracteredz.com'
export const SITE_NAME = 'Caractère Store'
export const LOGO_URL =
  'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo.jpg'

export const PHONE = '+213557440522'
export const PHONE_DISPLAY = '+213 557 440 522'
export const WHATSAPP = 'https://wa.me/213557440522'
export const EMAIL = 'yakoumobi@gmail.com'
export const INSTAGRAM = 'https://instagram.com/caractere.store'

export const CITY = 'Alger'
export const COUNTRY = 'DZ'

/** Identité de l'organisation — réutilisée par toutes les pages. */
export const organizationLd = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: ['Caractere Store', 'Caractère DZ', 'caracteredz'],
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: LOGO_URL },
  image: LOGO_URL,
  email: EMAIL,
  telephone: PHONE,
  sameAs: [INSTAGRAM, WHATSAPP],
  address: {
    '@type': 'PostalAddress',
    addressLocality: CITY,
    addressCountry: COUNTRY,
  },
} as const

/**
 * Fiche établissement (LocalBusiness) : c'est ce bloc qui alimente le pack
 * local de Google et les réponses « près de chez moi » des assistants IA.
 */
export const localBusinessLd = {
  '@type': ['LocalBusiness', 'ClothingStore'],
  '@id': `${SITE_URL}/#localbusiness`,
  name: SITE_NAME,
  description:
    "Atelier de personnalisation textile à Alger : broderie machine, impression DTF et sérigraphie pour uniformes d'entreprise, vêtements de travail et goodies. Livraison dans les 58 wilayas d'Algérie.",
  url: SITE_URL,
  logo: LOGO_URL,
  image: LOGO_URL,
  telephone: PHONE,
  email: EMAIL,
  priceRange: '950 DA – 5 900 DA',
  currenciesAccepted: 'DZD',
  paymentAccepted: 'Espèces, Paiement à la livraison, BaridiMob, CCP',
  address: {
    '@type': 'PostalAddress',
    addressLocality: CITY,
    addressRegion: 'Alger',
    addressCountry: COUNTRY,
  },
  areaServed: {
    '@type': 'Country',
    name: 'Algérie',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '14:00',
    },
  ],
  sameAs: [INSTAGRAM, WHATSAPP],
} as const

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function faqLd(faqs: { q: string; r: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.r },
    })),
  }
}

/**
 * Emballe un ou plusieurs nœuds dans un `@graph` unique : un seul script
 * JSON-LD par page, ce que les validateurs Google préfèrent.
 */
export function jsonLdGraph(...nodes: unknown[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}

/** <script type="application/ld+json"> prêt à insérer dans une page serveur. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
