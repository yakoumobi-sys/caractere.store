import type { Produit } from '@/types'

export interface B2BProduit extends Produit {
  minimum: number
  image: string
  famille: string
  paliers: { minimum: number; prix: number }[]
}

// Grille Caractère fournie le 4 octobre 2026. Le palier « +50 »
// commence à 50 pièces, comme la mention « à partir de 50 pièces ».
const rows: [string, string, string, string, number[], number?][] = [
  ['tshirt-premium', 'T-shirt Premium', 'tshirt', 'T-shirt', [2100, 1950, 1750]],
  ['tshirt-medium', 'T-shirt Medium', 'tshirt', 'T-shirt', [1950, 1750, 1550]],
  ['tshirt-events', 'T-shirt Events', 'tshirt', 'T-shirt', [750], 50],
  ['polo', 'Polo personnalisé', 'polo', 'Polo', [2350, 2050, 1950]],
  ['gilet-premium', 'Gilet Premium', 'gilet', 'Gilet de travail', [2750, 2550, 2350]],
  ['gilet-medium', 'Gilet Medium', 'gilet', 'Gilet de travail', [2500, 2350, 2150]],
  ['casquette', 'Casquette personnalisée', 'casquette', 'Casquette', [1500, 1150, 950]],
  ['totebag', 'Tote bag personnalisé', 'totebag', 'Totebag', [950, 750, 600]],
  ['gilet-jaune', 'Gilet jaune personnalisé', 'gilet-securite', 'Gilet de securite', [750]],
  ['tablier', 'Tablier personnalisé', 'tablier', 'Tablier', [1200]],
]

export const B2B_PRODUITS: B2BProduit[] = rows.map(([id, nom, image, famille, prix, minimum = 1], ordre) => ({
  id: `b2b-${id}`, nom, emoji: '', actif: true, ordre,
  description: minimum === 50 ? 'Disponible à partir de 50 pièces' : prix.length === 1 ? 'Prix unitaire fixe' : 'Tarifs dégressifs dès 20 et 50 pièces',
  prix_base: prix[0], minimum, famille,
  image: `/produits-photos/${image}.jpg`,
  paliers: prix.map((p, index) => ({ minimum: prix.length === 1 ? minimum : [1, 20, 50][index], prix: p })),
}))

export function findB2BProduit(value?: string | null) {
  return B2B_PRODUITS.find(p => p.id === value || p.nom === value)
}

export function getB2BPrice(produit: B2BProduit, quantite: number) {
  if (!Number.isSafeInteger(quantite) || quantite < produit.minimum || quantite > 100000) {
    throw new RangeError(`La quantité doit être un entier entre ${produit.minimum} et 100 000.`)
  }
  const unit = [...produit.paliers].reverse().find(p => quantite >= p.minimum)!.prix
  return { unit, total: unit * quantite, remise: 0 }
}

export function getB2BTiers(produit: B2BProduit, quantite: number) {
  return produit.paliers.map((p, index) => {
    const next = produit.paliers[index + 1]?.minimum
    return {
      label: next ? `${p.minimum}–${next - 1} pcs` : p.minimum === 1 ? 'Dès 1 pièce' : `${p.minimum}+ pcs`,
      info: `${p.prix.toLocaleString('fr-FR')} DA / pièce`,
      active: quantite >= p.minimum && (!next || quantite < next),
    }
  })
}

// Valide les demandes B2B et recalcule leurs prix côté serveur.
// Le marqueur de catalogue n'est pas une colonne de la table commandes.
export function applyB2BPricing(body: Record<string, unknown>) {
  const { catalogue, ...commande } = body
  if (catalogue !== 'entreprises-2026-10') return commande
  const produit = findB2BProduit(typeof body.produit === 'string' ? body.produit : '')
  if (!produit) throw new RangeError('Choisissez un produit du catalogue entreprises.')
  const { unit, total } = getB2BPrice(produit, body.quantite as number)
  return { ...commande, produit: produit.nom, prix_unitaire: unit, prix_total: total }
}
