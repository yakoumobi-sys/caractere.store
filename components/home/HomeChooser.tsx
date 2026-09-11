import Link from 'next/link'
import styles from './HomeChooser.module.css'

const WA = 'https://wa.me/213557440522?text=' + encodeURIComponent('Bonjour Caractère, je souhaite une simulation pour des vêtements personnalisés.')

export default function HomeChooser() {
  return (
    <div className={styles.home}>
      <a className={styles.skip} href="#contenu">Aller au contenu</a>
      <header className={styles.header}>
        <Link href="/" aria-label="Caractère — accueil"><img src="/logo.jpg" alt="Caractère" width={120} height={48} /></Link>
        <nav aria-label="Navigation principale"><Link href="/produits">Produits</Link><Link href="/print-on-demand">Créer ma marque</Link><Link href="/entreprises">Mon équipe</Link></nav>
        <a href={WA} className={styles.button} target="_blank" rel="noopener noreferrer">Parlons de ton projet</a>
      </header>
      <main id="contenu">
        <section className={styles.hero}>
          <div>
            <p className={styles.label}>PERSONNALISATION TEXTILE · ALGER</p>
            <h1>Des vêtements<br />qui portent<br /><span>ta marque.</span></h1>
            <p className={styles.intro}>Pour lancer ta collection ou habiller ton équipe. T-shirts, polos, sweats et accessoires personnalisés, dès une pièce.</p>
            <div className={styles.actions}><a href={WA} className={styles.button} target="_blank" rel="noopener noreferrer">Demander une simulation ↗</a><Link href="/produits" className={styles.secondary}>Voir les produits</Link></div>
            <p className={styles.note}>DTF & broderie · Production à Alger · Livraison nationale</p>
          </div>
          <figure className={styles.visual}><img src="/collection/IMG_7471.jpeg" alt="T-shirts imprimés avec des motifs automobiles sur un portant" width={900} height={1200} fetchPriority="high" /><figcaption>Une idée. Une impression. Ta collection.</figcaption></figure>
        </section>
        <section className={styles.paths} aria-labelledby="besoin">
          <p className={styles.label}>À CHAQUE PROJET, SON POINT DE DÉPART</p>
          <h2 id="besoin">Qu’est-ce que tu veux créer ?</h2>
          <div className={styles.grid}>
            <Link href="/print-on-demand" className={styles.card}><span className={styles.number}>01 / CRÉATEURS</span><h3>Lancer ma marque</h3><p>Tu crées tes designs. Nous imprimons à la commande, sans stock à constituer.</p><span className={styles.link}>Découvrir l’impression à la demande ↗</span></Link>
            <Link href="/entreprises" className={styles.card}><span className={styles.number}>02 / ENTREPRISES & ÉQUIPES</span><h3>Habiller mon équipe</h3><p>Des vêtements avec ton logo pour ton restaurant, ton entreprise, ton école ou ton événement.</p><span className={styles.link}>Préparer ma commande ↗</span></Link>
            <Link href="/collection" className={styles.card}><span className={styles.number}>03 / COLLECTION</span><h3>Trouver mon style</h3><p>Découvre nos designs et choisis une pièce de la collection Caractère.</p><span className={styles.link}>Voir la collection ↗</span></Link>
          </div>
          <Link href="/back-to-school" className={styles.promo}>Les packs et offres du moment <span aria-hidden="true">↗</span></Link>
        </section>
        <section className={styles.products} aria-labelledby="supports">
          <div className={styles.sectionHead}><h2 id="supports">Ton logo, sur la bonne pièce.</h2><Link href="/produits" className={styles.secondary}>Tout le catalogue ↗</Link></div>
          <div className={styles.productGrid}>{[
            {name:'T-shirt',img:'tshirt.jpg'}, {name:'Polo',img:'polo.jpg'}, {name:'Hoodie',img:'hoodie.jpg'}, {name:'Casquette',img:'casquette.jpg'},
          ].map(p=><Link key={p.name} href={`/configurateur?produit=${encodeURIComponent(p.name)}`}><img src={`/produits-photos/${p.img}`} alt={`${p.name} personnalisable`} width={600} height={750} loading="lazy" /><span>{p.name}<span aria-hidden="true">↗</span></span></Link>)}</div>
        </section>
        <section className={styles.contact}>
          <div><p className={styles.label}>ON COMMENCE AVEC TON IDÉE</p><h2>Tu as déjà un logo ?<br />Envoie-le-nous.</h2><p>Précise le vêtement et la quantité souhaités. Nous préparons ta simulation et ton devis.</p></div>
          <div className={styles.contactActions}><a href={WA} className={styles.button} target="_blank" rel="noopener noreferrer">Envoyer mon logo sur WhatsApp ↗</a><Link href="/devis-express">Je préfère remplir un formulaire</Link><Link href="/designer">Créer mon design moi-même</Link></div>
        </section>
      </main>
      <footer className={styles.footer}><p>Caractère · Vêtements personnalisés à Alger</p><nav aria-label="Informations"><Link href="/avis">Avis clients</Link><Link href="/comment-ca-marche">Comment ça marche</Link><Link href="/mentions-legales">Mentions légales</Link><a href="tel:+213557440522">+213 557 440 522</a></nav></footer>
    </div>
  )
}
