"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HomeChooser.module.css";

type Slide = {
  number: string;
  kicker: string;
  title: string;
  description: string;
  button: string;
  href: string;
  secondary: string;
  secondaryHref: string;
  visual: "collection" | "hoodie" | "business";
};

const slides: Slide[] = [
  {
    number: "01",
    kicker: "VOTRE STYLE · NOTRE SAVOIR-FAIRE",
    title: "Votre idée. Notre caractère.",
    description: "T-shirts, hoodies, polos. Des pièces à votre image, personnalisées à Alger dès une seule pièce.",
    button: "Personnaliser un vêtement",
    href: "/configurateur",
    secondary: "Explorer les produits",
    secondaryHref: "/produits",
    visual: "collection",
  },
  {
    number: "02",
    kicker: "CRÉEZ SANS LIMITES",
    title: "Le hoodie. À votre image.",
    description: "Choisissez votre couleur, ajoutez votre logo et visualisez votre prochaine pièce.",
    button: "Créer mon hoodie",
    href: "/configurateur?produit=Hoodie",
    secondary: "Voir le catalogue",
    secondaryHref: "/produits",
    visual: "hoodie",
  },
  {
    number: "03",
    kicker: "POUR LES ÉQUIPES QUI SE DÉMARQUENT",
    title: "Votre équipe. Votre signature.",
    description: "Des tenues professionnelles personnalisées en broderie ou en DTF. Du prototype à la grande série.",
    button: "Configurer ma commande",
    href: "/configurateur",
    secondary: "Solutions entreprises",
    secondaryHref: "/entreprises",
    visual: "business",
  },
];

const colors = [
  { name: "Sable", value: "#a99e8f" },
  { name: "Bleu", value: "#61849a" },
  { name: "Bordeaux", value: "#873c46" },
  { name: "Noir", value: "#343333" },
] as const;

const collages = {
  collection: [
    { src: "/designer-mockups/hoodie_new.png", alt: "Hoodie à personnaliser", cls: "lookLeft" },
    { src: "/designer-mockups/tshirt_oversized_new.png", alt: "T-shirt oversized personnalisable", cls: "lookCenter" },
    { src: "/designer-mockups/gilet.png", alt: "Gilet à personnaliser", cls: "lookRight" },
  ],
  business: [
    { src: "/designer-mockups/gilet.png", alt: "Gilet professionnel", cls: "lookLeft" },
    { src: "/designer-mockups/polo.jpg", alt: "Polo professionnel", cls: "lookCenter" },
    { src: "/designer-mockups/tshirt.png", alt: "T-shirt pour entreprises", cls: "lookRight" },
  ],
} as const;

export default function HomeChooser() {
  const [current, setCurrent] = useState(0);
  const [color, setColor] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const selected = slides[current];
  const collageItems = selected.visual === "business" ? collages.business : collages.collection;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(
      () => setCurrent((previous) => (previous + 1) % slides.length),
      9500
    );
    return () => window.clearInterval(id);
  }, [paused, current]);

  const next = () => setCurrent((old) => (old + 1) % slides.length);
  const previous = () => setCurrent((old) => (old - 1 + slides.length) % slides.length);

  return (
    <main
      className={styles.home}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Caractère, accueil">
          CARACTÈRE<span className={styles.brandDot}>.</span>
        </Link>
        <p className={styles.headerTag}>ATELIER DE PERSONNALISATION TEXTILE <span>—</span> ALGER</p>
        <nav className={styles.topNav} aria-label="Navigation principale">
          <Link href="/entreprises">Entreprises</Link>
          <Link href="/print-on-demand">Print on Demand</Link>
          <Link href="/produits">Produits</Link>
          <Link href="/configurateur" className={styles.navCta}>
            Personnaliser <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <section
        className={styles.hero}
        aria-roledescription="Carrousel"
        aria-label="Découvrez Caractère"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const delta = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 60) delta < 0 ? next() : previous();
          touchStartX.current = null;
        }}
      >
        <div className={styles.watermark} aria-hidden="true">CARACTÈRE</div>
        <div className={styles.sideNote} aria-hidden="true">CONÇU POUR CRÉER • FAIT À ALGER</div>
        <div className={styles.art} key={"art-" + current}>
          {selected.visual === "hoodie" ? (
            <div className={styles.singleLook}>
              <div className={styles.hoodieImage}>
                <Image
                  src="/designer-mockups/hoodie_new.png"
                  alt="Hoodie personnalisable Caractère"
                  fill
                  priority
                  sizes="(max-width: 720px) 90vw, 60vw"
                  className={styles.hoodieBase}
                />
                <div
                  className={styles.hoodieColor}
                  style={{ backgroundColor: colors[color].value }}
                  aria-hidden="true"
                />
              </div>
              <div className={styles.orbit} aria-hidden="true" />
            </div>
          ) : (
            <div className={styles.collage}>
              {collageItems.map((item, index) => (
                <div
                  key={item.src}
                  className={[styles.look, styles[item.cls]].join(" ")}
                  style={{ animationDelay: String(index * 140) + "ms" }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    priority={current === 0}
                    sizes="(max-width: 720px) 55vw, 37vw"
                    className={styles.garmentImage}
                  />
                </div>
              ))}
            </div>
          )}
          <div className={styles.groundShadow} aria-hidden="true" />
        </div>

        <div
          className={[styles.details, selected.visual === "hoodie" ? styles.detailsHoodie : ""].join(" ")}
          key={"details-" + current}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className={styles.eyebrow}>{selected.kicker}</span>
          <h1>{selected.title}</h1>
          <p>{selected.description}</p>
          {selected.visual === "hoodie" && (
            <fieldset className={styles.swatches}>
              <legend>Couleur d&apos;inspiration <span>— {colors[color].name}</span></legend>
              <div className={styles.swatchRow}>
                {colors.map((choice, index) => (
                  <button
                    key={choice.name}
                    type="button"
                    className={[styles.swatch, color === index ? styles.swatchSelected : ""].join(" ")}
                    style={{ backgroundColor: choice.value }}
                    title={choice.name}
                    aria-label={"Couleur " + choice.name}
                    aria-pressed={color === index}
                    onClick={() => setColor(index)}
                  />
                ))}
              </div>
              <small>Aperçu d&apos;ambiance non contractuel</small>
            </fieldset>
          )}
          <Link className={styles.primaryCta} href={selected.href}>
            {selected.button}<span aria-hidden="true">↗</span>
          </Link>
          <Link className={styles.secondaryCta} href={selected.secondaryHref}>
            {selected.secondary}<span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className={styles.heroFooter}>
          <div className={styles.counter}>
            <strong>{selected.number}</strong><span>/</span><span>0{slides.length}</span>
            <small>EXPLORER LES UNIVERS</small>
          </div>
          <div className={styles.pagination} aria-label="Sélectionner une collection">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.number}
                className={[styles.pageDot, index === current ? styles.pageDotActive : ""].join(" ")}
                aria-label={"Afficher l'univers " + slide.number}
                aria-current={index === current ? "true" : undefined}
                onClick={() => setCurrent(index)}
              />
            ))}
          </div>
          <div className={styles.arrows}>
            <button type="button" onClick={previous} aria-label="Univers précédent">←</button>
            <button type="button" onClick={next} aria-label="Univers suivant">→</button>
          </div>
        </div>
      </section>
      <div className={styles.bottomBar}>
        <span>FABRIQUÉ AVEC CARACTÈRE.</span>
        <span>DTF · BRODERIE · PRINT ON DEMAND</span>
        <Link href="/configurateur">VOTRE PIÈCE COMMENCE ICI ↗</Link>
      </div>
    </main>
  );
}
