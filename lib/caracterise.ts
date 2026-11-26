export const CARACTERISE_PRODUCTS = [
  {
    id: 'tshirt',
    label: 'T-shirt',
    name: 'T-shirt caractérisé',
    description: 'Pour vos événements, votre staff ou votre prochaine collection.',
    action: 'Personnaliser mon T-shirt',
    image: '/images/caracterise/tshirt.webp',
    cutout: '/home-cutouts/tshirt.png',
  },
  {
    id: 'polo',
    label: 'Polo',
    name: 'Polo caractérisé',
    description: 'Une tenue d’équipe soignée pour l’accueil, le service ou la vente.',
    action: 'Personnaliser mon polo',
    image: '/images/caracterise/polo.webp',
    cutout: '/home-cutouts/polo.png',
  },
  {
    id: 'gilet',
    label: 'Gilet',
    name: 'Gilet caractérisé',
    description: 'Un gilet de travail multipoches pour vos équipes sur le terrain.',
    action: 'Personnaliser mon gilet',
    image: '/images/caracterise/gilet.webp',
    cutout: '/home-cutouts/gilet.png',
  },
] as const

export function caracteriseSimulationHref(product?: typeof CARACTERISE_PRODUCTS[number]['id']) {
  return product ? `/simulation?gamme=caracterise&product=${product}` : '/simulation?gamme=caracterise'
}
