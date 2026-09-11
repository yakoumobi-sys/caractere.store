import Link from 'next/link'
import { SECTEURS } from '@/lib/entreprises-data'

const WHATSAPP = 'https://wa.me/213557440522'
const INSTAGRAM = 'https://instagram.com/caractere.store'

// Les anciennes entrées « Services » et « Produits » pointaient vers /#services
// et /#produits, deux ancres qui n'existent sur aucune page. Elles mènent
// désormais aux vraies destinations.
const SAVOIR_FAIRE = [
  { label: 'Impression DTF', href: '/print-on-demand' },
  { label: 'Broderie machine', href: '/entreprises' },
  { label: 'Uniformes entreprise', href: '/entreprises' },
  { label: 'Comment ça marche', href: '/comment-ca-marche' },
]

const PIECES = [
  { label: 'Tous les supports', href: '/produits' },
  { label: 'La collection', href: '/collection' },
  { label: 'Personnaliser une pièce', href: '/configurateur' },
  { label: 'Créer un design', href: '/designer' },
]

export default function Footer() {
  return (
    <footer className="c-scope cf-root">
      <style>{`
        .cf-root { background: var(--c-bg); color: var(--c-text); border-top: 1px solid var(--c-line); padding-block: 64px 40px; }
        .cf-grille { display: grid; grid-template-columns: 1.4fr repeat(3, minmax(0, 1fr)); gap: 40px; padding-bottom: 44px; border-bottom: 1px solid var(--c-line); }
        .cf-marque { font-family: var(--font-display), 'Inter', sans-serif; font-size: 1.25rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 12px; }
        .cf-baseline { color: var(--c-text-dim); font-size: .875rem; line-height: 1.6; max-width: 320px; }
        .cf-titre { font-size: .6875rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--c-text-dim); margin-bottom: 16px; }
        .cf-liste { list-style: none; display: flex; flex-direction: column; gap: 11px; }
        .cf-liste a, .cf-liste span { color: var(--c-text-dim); font-size: .875rem; text-decoration: none; }
        .cf-liste a:hover { color: var(--c-text); }
        .cf-bas { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-top: 26px; }
        .cf-bas p, .cf-bas a { color: var(--c-text-dim); font-size: .8125rem; text-decoration: none; }
        .cf-bas a:hover { color: var(--c-text); }
        .cf-bas nav { display: flex; flex-wrap: wrap; gap: 20px; }
        @media (max-width: 900px) {
          .cf-grille { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 24px; }
          .cf-marque-bloc { grid-column: 1 / -1; }
        }
      `}</style>

      <div className="c-wrap">
        <div className="cf-grille">
          <div className="cf-marque-bloc">
            <div className="cf-marque">Caractère</div>
            <p className="cf-baseline">
              Atelier de personnalisation textile à Alger. Impression DTF, broderie et
              sérigraphie, de la pièce unique à la série.
            </p>
          </div>

          <div>
            <div className="cf-titre">Savoir-faire</div>
            <ul className="cf-liste">
              {SAVOIR_FAIRE.map(s => (
                <li key={s.label}><Link href={s.href}>{s.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Maillage interne vers l'univers B2B : chaque page du site transmet
              de l'autorité aux pages secteur, qui sont les plus concurrentielles. */}
          <div>
            <div className="cf-titre">Entreprises</div>
            <ul className="cf-liste">
              <li><Link href="/entreprises">Uniformes personnalisés</Link></li>
              {SECTEURS.slice(0, 4).map(s => (
                <li key={s.slug}><Link href={`/entreprises/${s.slug}`}>{s.nom}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="cf-titre">Pièces &amp; contact</div>
            <ul className="cf-liste">
              {PIECES.slice(0, 2).map(p => (
                <li key={p.label}><Link href={p.href}>{p.label}</Link></li>
              ))}
              <li><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">@caractere.store</a></li>
              <li><span>Alger, Algérie</span></li>
            </ul>
          </div>
        </div>

        <div className="cf-bas">
          <p>© {new Date().getFullYear()} Caractère Store — Alger, 58 wilayas</p>
          <nav aria-label="Informations légales">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/avis">Avis clients</Link>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
