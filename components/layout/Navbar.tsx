'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import styles from './Navbar.module.css'

const WHATSAPP = 'https://wa.me/213557440522'

// Barre principale : les quatre destinations qui font l'offre. Le reste des
// parcours vit dans le panneau, pour ne pas surcharger l'en-tête.
const PRIMAIRE = [
  { href: '/produits', label: 'Produits' },
  { href: '/collection', label: 'Collection' },
  { href: '/entreprises', label: 'Entreprises' },
  { href: '/print-on-demand', label: 'Print on demand' },
]

// Parcours secondaires, visibles uniquement dans le panneau déroulant.
// `/outils` a été retiré : la route n'existe pas, le lien renvoyait un 404
// depuis chaque page qui affiche cette barre.
const SECONDAIRE = [
  { href: '/designer', label: 'Designer' },
  { href: '/studio-3d', label: 'Studio 3D' },
  { href: '/devis-express', label: 'Devis express' },
  { href: '/comment-ca-marche', label: 'Comment ça marche' },
  { href: '/avis', label: 'Avis clients' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null)
  const boutonRef = useRef<HTMLButtonElement>(null)
  const panneauRef = useRef<HTMLDivElement>(null)

  // Reflète l'état de connexion (persisté via cookie/localStorage par
  // lib/supabase.ts) — même pattern que app/admin/layout.tsx.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription?.unsubscribe()
  }, [])

  const fermer = useCallback(() => {
    setMenuOpen(false)
    // Le focus revient sur le bouton qui a ouvert le panneau, sinon il
    // retombe sur <body> et la navigation au clavier repart du début.
    boutonRef.current?.focus()
  }, [])

  // Échap ferme, et le focus entre dans le panneau à l'ouverture.
  useEffect(() => {
    if (!menuOpen) return
    const surTouche = (e: KeyboardEvent) => { if (e.key === 'Escape') fermer() }
    document.addEventListener('keydown', surTouche)
    panneauRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    return () => document.removeEventListener('keydown', surTouche)
  }, [menuOpen, fermer])

  const prenom = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0]

  return (
    <header className={`c-scope ${styles.root}`}>
      <div className={`c-wrap ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Caractère — accueil">
          <img src="/logo.jpg" alt="" width={34} height={34} />
          <span>Caractère</span>
        </Link>

        <nav className={styles.links} aria-label="Navigation principale">
          {PRIMAIRE.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </nav>

        <div className={styles.right}>
          <Link href={user ? '/dashboard' : '/auth/login'} className={styles.compte}>
            {user ? prenom : 'Se connecter'}
          </Link>
          <Link href="/configurateur" className={`c-btn c-btn-accent ${styles.cta}`}>Personnaliser</Link>
          <button
            ref={boutonRef}
            type="button"
            className={styles.burger}
            aria-expanded={menuOpen}
            aria-controls="cn-panneau"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => (menuOpen ? fermer() : setMenuOpen(true))}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menuOpen
                ? <><path d="M5 5l14 14" /><path d="M19 5L5 19" /></>
                : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.panneau} id="cn-panneau" ref={panneauRef} hidden={!menuOpen}>
        <nav className={`c-wrap ${styles.panneauGrille}`} aria-label="Tous les parcours">
          {PRIMAIRE.map(l => (
            <Link key={l.href} href={l.href} className={styles.fort} onClick={fermer}>{l.label}</Link>
          ))}
          {SECONDAIRE.map(l => (
            <Link key={l.href} href={l.href} onClick={fermer}>{l.label}</Link>
          ))}
          <div className={styles.panneauCta}>
            <Link href="/configurateur" className="c-btn c-btn-accent" onClick={fermer}>Personnaliser une pièce</Link>
            <Link href={user ? '/dashboard' : '/auth/login'} className="c-btn c-btn-ghost" onClick={fermer}>
              {user ? 'Mon compte' : 'Se connecter'}
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-ghost" onClick={fermer}>
              WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
