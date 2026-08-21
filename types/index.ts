// ── JARVIS (assistant personnel) ──
export interface JarvisTask {
  id: string
  title: string
  notes: string | null
  due_date: string | null
  due_time: string | null
  priority: 'basse' | 'normale' | 'haute'
  category: string
  status: 'a_faire' | 'en_cours' | 'fait'
  created_at: string
}

export interface JarvisEvent {
  id: string
  title: string
  type: 'reunion' | 'dejeuner' | 'diner' | 'rdv' | 'appel' | 'autre'
  with_person: string | null
  location: string | null
  start_at: string
  end_at: string | null
  notes: string | null
  created_at: string
}

export interface JarvisTransaction {
  id: string
  type: 'revenu' | 'depense'
  amount: number
  currency: string
  category: string
  description: string | null
  date: string
  created_at: string
}

export interface JarvisGoal {
  id: string
  title: string
  description: string | null
  category: string
  target_date: string | null
  progress: number
  status: 'en_cours' | 'atteint' | 'abandonne'
  created_at: string
}

export interface JarvisProject {
  id: string
  name: string
  description: string | null
  status: 'actif' | 'en_pause' | 'termine'
  progress: number
  deadline: string | null
  created_at: string
}

export interface JarvisMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

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
  produits?: string[]
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

export interface Avis {
  id: string
  nom: string
  note: number
  commentaire: string
  statut: 'en_attente' | 'approuve' | 'rejete'
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
