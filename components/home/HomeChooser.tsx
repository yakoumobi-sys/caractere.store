import Image from "next/image";
import Link from "next/link";
import styles from "./HomeChooser.module.css";

const choices = [
  { title: "Entreprise", description: "Habillez votre équipe.", action: "Configurer ma commande", href: "/entreprises/commande", image: "/images/campaign/entreprise-uniformes.webp" },
  { title: "Print on demand", description: "Lancez votre marque.", action: "Créer mon compte", href: "/auth/signup", image: "/images/campaign/streetwear.webp" },
  { title: "Produits", description: "Trouvez votre prochaine pièce.", action: "Découvrir le catalogue", href: "/produits", image: "/images/campaign/hero.webp" },
] as const;

export default function HomeChooser() {
  return (
    <main className={styles.home}>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.brand}>Caractère<span aria-hidden="true">.</span></p>
          <h1>À chaque idée,<br />son caractère.</h1>
        </header>
        <nav className={styles.choices} aria-label="Choisissez votre univers Caractère">
          {choices.map((choice) => (
            <Link className={styles.choice} href={choice.href} key={choice.href}>
              <span className={styles.image}>
                <Image src={choice.image} alt="" fill priority sizes="(max-width: 700px) 160px, (max-width: 1100px) 32vw, 340px" />
              </span>
              <span className={styles.copy}>
                <span className={styles.title}>{choice.title}</span>
                <span className={styles.description}>{choice.description}</span>
                <span className={styles.action}>{choice.action}</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <footer className={styles.footer}>Imaginé par vous. Personnalisé à Alger.</footer>
    </main>
  );
}
