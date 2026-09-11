'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

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
    <header className="c-scope cn-root">
      <style>{`
        .cn-root { position: sticky; top: 0; z-index: 60; background: rgba(11,11,13,.82); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--c-line); }
        .cn-inner { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 68px; }
        .cn-brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: var(--c-text); flex-shrink: 0; }
        .cn-brand img { width: 34px; height: 34px; object-fit: contain; border-radius: 6px; }
        .cn-brand span { font-family: var(--font-display), 'Inter', sans-serif; font-size: 1.05rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
        .cn-links { display: flex; align-items: center; gap: 28px; }
        .cn-links a { color: var(--c-text-dim); text-decoration: none; font-size: .875rem; font-weight: 500; white-space: nowrap; transition: color .2s ease; }
        .cn-links a:hover { color: var(--c-text); }
        .cn-right { display: flex; align-items: center; gap: 10px; }
        .cn-compte { color: var(--c-text-dim); text-decoration: none; font-size: .875rem; font-weight: 500; padding: 10px 4px; white-space: nowrap; }
        .cn-compte:hover { color: var(--c-text); }
        .cn-cta { min-height: 42px; padding: 10px 20px; font-size: .875rem; }
        .cn-burger { display: none; align-items: center; justify-content: center; width: 44px; height: 44px; background: none; border: 1px solid var(--c-line-strong); border-radius: 10px; color: var(--c-text); cursor: pointer; }
        .cn-burger svg { width: 18px; height: 18px; }

        .cn-panneau { border-top: 1px solid var(--c-line); background: var(--c-bg); }
        .cn-panneau-grille { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px 24px; padding-block: 18px 26px; }
        .cn-panneau a { display: block; padding: 13px 4px; color: var(--c-text-dim); text-decoration: none; font-size: .9375rem; font-weight: 500; border-bottom: 1px solid var(--c-line); }
        .cn-panneau a:hover { color: var(--c-text); }
        .cn-panneau .cn-p-fort { color: var(--c-text); font-weight: 600; }
        .cn-panneau-cta { grid-column: 1 / -1; margin-top: 16px; display: flex; flex-wrap: wrap; gap: 10px; }

        @media (max-width: 1000px) {
          .cn-links, .cn-right .cn-compte, .cn-right .cn-cta { display: none; }
          .cn-burger { display: inline-flex; }
        }
        @media (min-width: 1001px) {
          .cn-panneau { display: none; }
        }
      `}</style>

      <div className="c-wrap cn-inner">
        <Link href="/" className="cn-brand" aria-label="Caractère — accueil">
          <img src="/logo.jpg" alt="" width={34} height={34} />
          <span>Caractère</span>
        </Link>

        <nav className="cn-links" aria-label="Navigation principale">
          {PRIMAIRE.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </nav>

        <div className="cn-right">
          <Link href={user ? '/dashboard' : '/auth/login'} className="cn-compte">
            {user ? prenom : 'Se connecter'}
          </Link>
          <Link href="/configurateur" className="c-btn c-btn-accent cn-cta">Personnaliser</Link>
          <button
            ref={boutonRef}
            type="button"
            className="cn-burger"
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

      <div className="cn-panneau" id="cn-panneau" ref={panneauRef} hidden={!menuOpen}>
        <nav className="c-wrap cn-panneau-grille" aria-label="Tous les parcours">
          {PRIMAIRE.map(l => (
            <Link key={l.href} href={l.href} className="cn-p-fort" onClick={fermer}>{l.label}</Link>
          ))}
          {SECONDAIRE.map(l => (
            <Link key={l.href} href={l.href} onClick={fermer}>{l.label}</Link>
          ))}
          <div className="cn-panneau-cta">
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
