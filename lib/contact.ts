// Coordonnées Caractère — source unique.
//
// Le numéro WhatsApp était recopié dans une vingtaine de fichiers et le compte
// Instagram existait en deux versions selon la page. Tout passe désormais par
// ce module : une correction faite ici se propage partout, et deux pages ne
// peuvent plus annoncer des coordonnées différentes.
//
// lib/seo.tsx réexporte ces constantes pour les données structurées, afin que
// Google et les moteurs de réponse lisent exactement le même NAP que le site.

/** Numéro au format international sans « + », tel que l'attend wa.me. */
export const WHATSAPP_NUMERO = '213557440522'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}`

export const TELEPHONE = '+213557440522'
export const TELEPHONE_AFFICHE = '+213 557 440 522'
export const TELEPHONE_LOCAL = '0557 44 05 22'

export const EMAIL = 'yakoumobi@gmail.com'

/**
 * Compte de communication de la marque.
 * Le site affichait historiquement @caractere.store ; le compte tenu à jour
 * par l'atelier est @mycaractere. Une seule valeur ici, plus de divergence.
 */
export const INSTAGRAM_HANDLE = '@mycaractere'
export const INSTAGRAM_URL = 'https://instagram.com/mycaractere'

export const VILLE = 'Alger'
export const PAYS = 'Algérie'
export const PAYS_CODE = 'DZ'

/** Construit un lien WhatsApp avec un message pré-rédigé. */
export function lienWhatsApp(message?: string): string {
  if (!message) return WHATSAPP_URL
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
}
