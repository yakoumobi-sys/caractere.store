import Link from 'next/link'
import { SECTEURS } from '@/lib/entreprises-data'
import styles from './Footer.module.css'

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
    <footer className={`c-scope ${styles.root}`}>
      <div className="c-wrap">
        <div className={styles.grille}>
          <div className={styles.marqueBloc}>
            <div className={styles.marque}>Caractère</div>
            <p className={styles.baseline}>
              Atelier de personnalisation textile à Alger. Impression DTF, broderie et
              sérigraphie, de la pièce unique à la série.
            </p>
          </div>

          <div>
            <div className={styles.titre}>Savoir-faire</div>
            <ul className={styles.liste}>
              {SAVOIR_FAIRE.map(s => (
                <li key={s.label}><Link href={s.href}>{s.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Maillage interne vers l'univers B2B : chaque page du site transmet
              de l'autorité aux pages secteur, qui sont les plus concurrentielles. */}
          <div>
            <div className={styles.titre}>Entreprises</div>
            <ul className={styles.liste}>
              <li><Link href="/entreprises">Uniformes personnalisés</Link></li>
              {SECTEURS.slice(0, 4).map(s => (
                <li key={s.slug}><Link href={`/entreprises/${s.slug}`}>{s.nom}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className={styles.titre}>Pièces &amp; contact</div>
            <ul className={styles.liste}>
              {PIECES.slice(0, 2).map(p => (
                <li key={p.label}><Link href={p.href}>{p.label}</Link></li>
              ))}
              <li><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">@caractere.store</a></li>
              <li><span>Alger, Algérie</span></li>
            </ul>
          </div>
        </div>

        <div className={styles.bas}>
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
