import Image from 'next/image'
import Link from 'next/link'
import { CARACTERISE_PRODUCTS, caracteriseSimulationHref } from '@/lib/caracterise'
import styles from './CaracteriseHome.module.css'

const questions = [
  {
    question: 'Qu’est-ce qu’un vêtement caractérisé ?',
    answer: 'On reprend les couleurs et les formes de votre logo pour composer un design qui épouse le vêtement. On vous propose les placements à l’avant et au dos, avec des marquages DTF localisés et de l’espace au-dessus de l’ourlet.',
  },
  {
    question: 'Quel est le prix de mon projet ?',
    answer: 'Le tarif dépend du vêtement, de la quantité et du marquage. Demandez une simulation gratuite pour recevoir un devis adapté à votre projet.',
  },
  {
    question: 'Puis-je commander pour toute mon équipe ?',
    answer: 'Oui. Vous pouvez demander une pièce ou une série pour votre équipe. Indiquez la quantité souhaitée dans votre demande, puis précisez les tailles avec l’atelier.',
  },
  {
    question: 'Livrez-vous dans ma wilaya ?',
    answer: 'Nous livrons dans les 58 wilayas. L’atelier vous précise les frais et le délai au moment du devis.',
  },
]

export default function CaracteriseHome() {
  const simulation = caracteriseSimulationHref()

  return (
    <div className={styles.site}>
      <a className={styles.skip} href="#contenu">Aller au contenu</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label="Caractère, accueil">
            CARACTÈRE<span>.</span>
          </Link>
          <nav className={styles.navigation} aria-label="Navigation principale">
            <a href="#modeles">Les modèles</a>
            <a href="#comment">Comment ça marche</a>
            <Link href="/entreprises">Entreprises</Link>
          </nav>
          <Link href={simulation} className={styles.headerCta}>Simulation gratuite</Link>
        </div>
      </header>

      <main id="contenu" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="titre">
          <div className={styles.heroVisual}>
            <Image src="/images/caracterise/campagne.webp" alt="T-shirt écru, polo noir et gilet de travail bleu nuit avec des motifs orange issus du même logo" fill priority sizes="(max-width: 760px) 100vw, 70vw" />
          </div>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>Atelier de personnalisation à Alger</p>
              <h1 id="titre">Le vêtement<br />devient le logo<span>.</span></h1>
              <p className={styles.lead}>Des T-shirts, polos et gilets dont le design reprend les couleurs et les formes de votre logo.</p>
              <div className={styles.heroActions}>
                <Link href={simulation} className={styles.button}>Créer ma tenue</Link>
                <a href="#modeles" className={styles.secondary}>Voir les modèles</a>
              </div>
              <p className={styles.heroNote}>Simulation gratuite · Sans engagement</p>
            </div>
          </div>
        </section>

        <ul className={styles.benefits} aria-label="Services Caractère">
          <li>À partir d’une pièce</li>
          <li>Design validé avant production</li>
          <li>Livraison dans les 58 wilayas</li>
        </ul>

        <section className={`${styles.wrap} ${styles.collection}`} id="modeles" aria-labelledby="titre-modeles">
          <div className={styles.sectionIntro}>
            <h2 id="titre-modeles">Choisissez votre vêtement.</h2>
            <p>Exemples de compositions. Votre design sera créé à partir de votre logo.</p>
          </div>
          <div className={styles.cards}>
            {CARACTERISE_PRODUCTS.map((product) => (
              <article className={styles.card} key={product.id}>
                <div className={styles.productImage}>
                  <Image src={product.image} alt={`Exemple de ${product.label.toLowerCase()} avec un marquage graphique orange`} fill sizes="(max-width: 680px) 92vw, (max-width: 1250px) 31vw, 395px" />
                </div>
                <div className={styles.cardContent}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <Link href={caracteriseSimulationHref(product.id)} className={styles.cardCta}>{product.action}</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.process} id="comment" aria-labelledby="titre-processus">
          <div className={styles.wrap}>
            <h2 id="titre-processus">Du logo au vêtement.</h2>
            <ol className={styles.steps}>
              <li><h3>Choisissez votre modèle</h3><p>T-shirt, polo ou gilet. Indiquez la quantité et vos préférences.</p></li>
              <li><h3>Envoyez votre logo</h3><p>Ajoutez votre fichier et transmettez la demande à l’atelier sur WhatsApp.</p></li>
              <li><h3>Validez le résultat</h3><p>Recevez votre simulation et votre devis. Vous validez le design avant la production.</p></li>
            </ol>
            <Link href={simulation} className={styles.button}>Demander ma simulation</Link>
          </div>
        </section>

        <section className={`${styles.wrap} ${styles.faq}`} aria-labelledby="titre-faq">
          <h2 id="titre-faq">Vos questions</h2>
          <div>
            {questions.map(({ question, answer }) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
