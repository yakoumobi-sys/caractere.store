// Informations commerciales — bloc partagé par le catalogue, la collection,
// le configurateur et le parcours revendeur, pour que les quatre pages disent
// exactement la même chose.
//
// Règle : chaque ligne reprend une information déjà engagée par le site
// (mentions légales, fiche établissement de lib/seo.tsx, fiches produits).
// Rien n'est inventé ici. Ce qui n'a pas été communiqué par l'atelier est
// annoncé comme « à confirmer » plutôt que comblé par une estimation.

import Link from 'next/link'
import styles from './InfosCommerciales.module.css'

export type InfoProduit = {
  matiere?: string
  grammage?: string
  /** Prix unitaire en DA, absent quand la pièce est chiffrée sur devis. */
  prix?: number
}

const daFormat = (n: number) => `${n.toLocaleString('fr-DZ')} DA`

export default function InfosCommerciales({
  produit,
  compact = false,
}: {
  /** Fiche de la pièce affichée, quand le bloc accompagne un produit précis. */
  produit?: InfoProduit
  compact?: boolean
}) {
  const rubriques: { titre: string; lignes: React.ReactNode[] }[] = [
    {
      titre: 'Ce que comprend le prix',
      lignes: [
        produit && typeof produit.prix === 'number'
          ? `${daFormat(produit.prix)} par pièce, impression DTF ou broderie comprise.`
          : 'Prix par pièce, impression DTF ou broderie comprise.',
        'Vectorisation de votre fichier incluse.',
        // Ce que le prix ne comprend pas est dit aussi clairement.
        'Hors frais de livraison, confirmés avec l’atelier selon votre wilaya.',
      ],
    },
    {
      titre: 'Matière',
      lignes: [
        produit?.matiere ?? 'Précisée sur chaque fiche produit.',
        produit?.grammage
          ? `Grammage : ${produit.grammage}.`
          : 'Grammage indiqué pour les pièces sur lesquelles l’atelier l’a communiqué.',
      ],
    },
    {
      titre: 'Délais',
      lignes: [
        'Production : 48 h ouvrées à partir de la validation de votre design.',
        'Livraison : 3 à 5 jours selon la wilaya, via nos partenaires transport.',
      ],
    },
    {
      titre: 'Livraison et paiement',
      lignes: [
        'Livraison dans les 58 wilayas.',
        'Frais de livraison confirmés avec l’atelier avant production — ils ne sont pas encore publiés par wilaya.',
        'Paiement : à la livraison, BaridiMob, CCP ou virement bancaire.',
      ],
    },
    {
      titre: 'Échange et garantie',
      lignes: [
        'Vous validez le design avant production, puis les photos avant expédition.',
        'Une pièce défectueuse par erreur de production est refaite gratuitement.',
        'Pas de retour pour changement d’avis sur une pièce personnalisée conforme au design approuvé.',
        <>
          Détail dans les{' '}
          <Link href="/mentions-legales" className={styles.lien}>
            conditions générales
          </Link>
          .
        </>,
      ],
    },
  ]

  return (
    <section className={`${styles.bloc} ${compact ? styles.compact : ''}`} aria-labelledby="infos-commerciales">
      <h2 id="infos-commerciales" className={styles.titre}>Avant de commander</h2>
      <div className={styles.grille}>
        {rubriques.map(rubrique => (
          <div key={rubrique.titre} className={styles.rubrique}>
            <h3 className={styles.rubriqueTitre}>{rubrique.titre}</h3>
            <ul className={styles.liste}>
              {rubrique.lignes.map((ligne, i) => (
                <li key={i}>{ligne}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
