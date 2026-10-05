import Link from "next/link";
import styles from "./HomeChooser.module.css";

const choices = [
  { title: "Entreprise", description: "Habillez votre équipe.", action: "Configurer ma commande", href: "/entreprises/commande", icon: "business" },
  { title: "Print on demand", description: "Lancez votre marque.", action: "Créer mon compte", href: "/auth/signup", icon: "print" },
  { title: "Produits", description: "Trouvez votre prochaine pièce.", action: "Découvrir le catalogue", href: "/produits", icon: "products" },
] as const;

function ChoiceIcon({ kind }: { kind: (typeof choices)[number]["icon"] }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {kind === "business" ? (
        <>
          <rect x="3" y="7" width="18" height="14" rx="3" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a22 22 0 0 0 18 0M12 11v4" />
        </>
      ) : kind === "print" ? (
        <>
          <rect x="6" y="2" width="12" height="6" rx="1" />
          <path d="M6 17H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M18 12h.01" />
          <rect x="6" y="14" width="12" height="8" rx="1" />
          <path d="M9 18h6" />
        </>
      ) : (
        <path d="m16 3 6 4-3 5-3-2v11H8V10l-3 2-3-5 6-4a4 4 0 0 0 8 0Z" />
      )}
    </svg>
  );
}

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
            <Link className={styles.choice} href={choice.href} key={choice.icon}>
              <span className={styles.icon}><ChoiceIcon kind={choice.icon} /></span>
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
