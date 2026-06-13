export interface Produit {
  id: string
  nom: string
  emoji: string
  description: string
  prix_base: number
  actif: boolean
  ordre: number
  created_at?: string
}

export interface Couleur {
  id: string
  nom: string
  hex: string
  actif: boolean
  ordre: number
}

export interface Taille {
  id: string
  nom: string
  actif: boolean
  ordre: number
}

export interface Commande {
  id: string
  reference: string
  statut: 'nouveau' | 'en_cours' | 'termine' | 'annule'
  produit: string
  quantite: number
  couleur: string
  tailles: string[]
  position: string
  technique: string
  urgent: boolean
  logo_url: string | null
  nom_client: string
  entreprise: string
  telephone: string
  email: string
  notes: string
  prix_unitaire: number
  prix_total: number
  created_at: string
}

export interface SiteConfig {
  id: string
  cle: string
  valeur: string
}

export interface OrderState {
  step: number
  product: string | null
  productPrice: number
  quantity: number
  color: string
  sizes: string[]
  logoFile: File | null
  logoUrl: string | null
  position: string
  technique: string
  urgent: boolean
  name: string
  company: string
  phone: string
  email: string
  notes: string
}
