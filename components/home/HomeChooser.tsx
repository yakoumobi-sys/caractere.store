"use client";

import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import CutoutGarment from "./CutoutGarment";
import Link from "next/link";
import styles from "./HomeChooser.module.css";

type Product = {
  id: string;
  name: string;
  kind: string;
  description: string;
  src: string;
  alt: string;
};

const products: Product[] = [
  {
    id: "oversized",
    name: "T-shirt Oversized",
    kind: "COLLECTION 01 — ESSENTIELS",
    description: "La coupe qui fait la différence. Créez une pièce unique, à votre image.",
    src: "/home-cutouts/tshirt-oversized.png",
    alt: "T-shirt oversized Caractère détouré",
  },
  {
    id: "hoodie",
    name: "Hoodie",
    kind: "COLLECTION 02 — STREETWEAR",
    description: "Votre prochain hoodie préféré. Ajoutez un logo, un design ou votre signature.",
    src: "/home-cutouts/hoodie.png",
    alt: "Hoodie Caractère détouré",
  },
  {
    id: "gilet",
    name: "Gilet professionnel",
    kind: "COLLECTION 03 — ENTREPRISES",
    description: "Un vêtement qui représente votre équipe, sur le terrain comme au bureau.",
    src: "/home-cutouts/gilet.png",
    alt: "Gilet professionnel Caractère détouré",
  },
  {
    id: "tshirt",
    name: "T-shirt classique",
    kind: "COLLECTION 04 — PERSONNALISATION",
    description: "Votre idée mérite d'être portée. Impression ou broderie dès une pièce.",
    src: "/home-cutouts/tshirt.png",
    alt: "T-shirt classique Caractère détouré",
  },
  {
    id: "casquette",
    name: "Casquette",
    kind: "COLLECTION 05 — ACCESSOIRES",
    description: "Le détail qui complète votre identité, avec votre logo.",
    src: "/home-cutouts/casquette.png",
    alt: "Casquette Caractère détourée",
  },
  {
    id: "tote",
    name: "Tote bag",
    kind: "COLLECTION 06 — ACCESSOIRES",
    description: "Votre message, partout avec vous. Un accessoire à personnaliser.",
    src: "/home-cutouts/tote-bag.png",
    alt: "Tote bag Caractère détouré",
  },
];

type Position = "left" | "center" | "right" | "hidden";

function getPosition(index: number, active: number): Position {
  const distance = (index - active + products.length) % products.length;
  if (distance === 0) return "center";
  if (distance === 1) return "right";
  if (distance === products.length - 1) return "left";
  return "hidden";
}

function getTransform(position: Position, drag: number): string {
  const offset = Math.round(drag);
  switch (position) {
    case "left":
      return `translate3d(calc(-50% - 67% + ${offset}px), 0, 0) rotate(-8deg) scale(.77)`;
    case "right":
      return `translate3d(calc(-50% + 67% + ${offset}px), 0, 0) rotate(8deg) scale(.77)`;
    case "center":
      return `translate3d(calc(-50% + ${offset}px), 0, 0) rotate(0deg) scale(1)`;
    default:
      return `translate3d(calc(-50% + ${offset}px), 0, 0) scale(.55)`;
  }
}

export default function HomeChooser() {
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const gesture = useRef<{ pointerId: number; startX: number } | null>(null);
  const product = products[active];

  const change = useCallback((direction: number) => {
    setActive((index) => (index + direction + products.length) % products.length);
  }, []);

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    gesture.current = { pointerId: event.pointerId, startX: event.clientX };
    setDragging(true);
    setDragX(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!gesture.current || gesture.current.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.current.startX;
    setDragX(Math.min(190, Math.max(-190, dx)));
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!gesture.current || gesture.current.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.current.startX;
    gesture.current = null;
    setDragging(false);
    setDragX(0);
    if (dx < -55) change(1);
    else if (dx > 55) change(-1);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const cancelDrag = () => {
    gesture.current = null;
    setDragging(false);
    setDragX(0);
  };

  return (
    <main className={styles.home}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Caractère, accueil">
          CARACTÈRE<span>.</span>
        </Link>
        <nav className={styles.nav} aria-label="Navigation principale">
          <Link href="/entreprises">Entreprises</Link>
          <Link href="/print-on-demand">Print on Demand</Link>
          <Link href="/produits">Produits</Link>
        </nav>
        <Link className={styles.headerCta} href="/configurateur">
          Personnaliser <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className={styles.hero} aria-label="Collection personnalisable Caractère">
        <div className={styles.heading}>
          <span className={styles.eyebrow}>CARACTÈRE — VOTRE ATELIER À ALGER</span>
          <h1>À chaque idée, <em>son caractère.</em></h1>
          <p>Glissez. Choisissez. Personnalisez.</p>
        </div>

        <div className={styles.showcase}>
          <div className={styles.watermark} aria-hidden="true">CARACTÈRE</div>
          <div className={styles.showcaseSide} aria-hidden="true">VOS IDÉES · NOTRE SAVOIR-FAIRE</div>

          <div
            className={[styles.stage, dragging ? styles.isDragging : ""].join(" ")}
            role="group"
            tabIndex={0}
            aria-label="Vêtements à personnaliser. Glissez à gauche ou à droite, ou utilisez les flèches du clavier."
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={cancelDrag}
            onLostPointerCapture={cancelDrag}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") { event.preventDefault(); change(1); }
              if (event.key === "ArrowLeft") { event.preventDefault(); change(-1); }
            }}
          >
            {products.map((item, index) => {
              const position = getPosition(index, active);
              return (
                <div
                  key={item.id}
                  className={styles.slot}
                  data-position={position}
                  style={{ transform: getTransform(position, dragX) }}
                  aria-hidden={position !== "center"}
                >
                  <CutoutGarment
                    src={item.src}
                    alt={position === "center" ? item.alt : ""}
                    visible={position !== "hidden"}
                    priority={index < 3}
                    sizes="(max-width: 720px) 76vw, (max-width: 1200px) 42vw, 570px"
                    className={styles.productImage}
                  />
                </div>
              );
            })}
          </div>
          <div className={styles.shadow} aria-hidden="true" />
          <div className={styles.dragHint} aria-hidden="true">
            <span>←</span> GLISSEZ LES ARTICLES <span>→</span>
          </div>
        </div>

        <div className={styles.productFooter}>
          <div className={styles.productInfo} key={product.id}>
            <span className={styles.productKind}>{product.kind}</span>
            <h2 aria-live="polite">{product.name}</h2>
            <p>{product.description}</p>
            <Link className={styles.primaryCta} href="/configurateur">
              Personnaliser cet article <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className={styles.controls}>
            <div className={styles.counter}><strong>{String(active + 1).padStart(2, "0")}</strong> / {String(products.length).padStart(2, "0")}</div>
            <div className={styles.dots} aria-label="Choisir un article">
              {products.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={index === active ? styles.dotActive : ""}
                  aria-label={"Voir " + item.name}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
            <div className={styles.arrows}>
              <button type="button" aria-label="Article précédent" onClick={() => change(-1)}>←</button>
              <button type="button" aria-label="Article suivant" onClick={() => change(1)}>→</button>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>VOTRE MARQUE. VOTRE ÉQUIPE. VOTRE IDENTITÉ.</span>
        <span>DTF · BRODERIE · PRINT ON DEMAND</span>
        <Link href="/entreprises">HABILLER MON ENTREPRISE ↗</Link>
      </footer>
    </main>
  );
}
