import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "./Entreprises.module.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  JsonLd,
  SITE_URL,
  SITE_NAME,
  LOGO_URL,
  WHATSAPP,
  PHONE_DISPLAY,
  jsonLdGraph,
  breadcrumbLd,
  faqLd,
} from "@/lib/seo";
import {
  SECTEURS,
  PALIERS,
  PRODUITS_B2B,
  TECHNIQUES,
  FAQ_ENTREPRISES,
  WILAYAS,
  ETAPES,
} from "@/lib/entreprises-data";

const PATH = "/entreprises";
const URL = `${SITE_URL}${PATH}`;

const TITLE =
  "Uniformes & vêtements de travail personnalisés pour entreprises — Alger";
const DESCRIPTION =
  "Uniformes, workwear et goodies personnalisés au logo de votre entreprise : broderie, impression DTF et sérigraphie à Alger. Aucun minimum de commande, devis en 2h, production 3–5 jours, livraison dans les 58 wilayas d'Algérie.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "uniforme entreprise Algérie",
    "vêtement de travail personnalisé Alger",
    "polo brodé logo entreprise",
    "broderie logo entreprise Algérie",
    "impression DTF Alger",
    "tenue professionnelle personnalisée DZ",
    "workwear Algérie",
    "goodies entreprise Alger",
    "devis uniformes entreprise Algérie",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    locale: "fr_DZ",
    images: [
      {
        url: LOGO_URL,
        alt: "Caractère Store — uniformes personnalisés pour entreprises",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [LOGO_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

const BLUE = "#1d1d1f";
const BLUE_PALE = "#f5f5f7";

/** Le graphe JSON-LD complet de la page : entreprise, service, offres, FAQ, fil d'Ariane. */
const structuredData = jsonLdGraph(
  {
    "@type": "WebPage",
    "@id": `${URL}#webpage`,
    url: URL,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "fr-DZ",
    isPartOf: { "@id": `${SITE_URL}/#organization` },
    about: { "@id": `${SITE_URL}/#localbusiness` },
    primaryImageOfPage: { "@type": "ImageObject", url: LOGO_URL },
  },
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Personnalisation d'uniformes et de vêtements de travail pour entreprises",
    serviceType:
      "Personnalisation textile B2B — broderie, impression DTF, sérigraphie",
    description: DESCRIPTION,
    provider: { "@id": `${SITE_URL}/#localbusiness` },
    areaServed: { "@type": "Country", name: "Algérie" },
    audience: {
      "@type": "BusinessAudience",
      name: "Entreprises, administrations et associations en Algérie",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "DZD",
      lowPrice: 950,
      highPrice: 5900,
      offerCount: PRODUITS_B2B.length,
      availability: "https://schema.org/InStock",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catalogue textile B2B",
      itemListElement: PRODUITS_B2B.map((p) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: `${p.nom} personnalisé`,
          description: p.detail,
        },
        price: p.prix,
        priceCurrency: "DZD",
        availability: "https://schema.org/InStock",
      })),
    },
  },
  {
    "@type": "ItemList",
    "@id": `${URL}#secteurs`,
    name: "Secteurs équipés par Caractère Store",
    itemListElement: SECTEURS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.nom,
      url: `${SITE_URL}${PATH}/${s.slug}`,
    })),
  },
  faqLd(FAQ_ENTREPRISES),
  breadcrumbLd([
    { name: "Accueil", path: "/" },
    { name: "Entreprises", path: PATH },
  ]),
);

export default function EntreprisesPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <Navbar />

      <main className={`bg-white ${styles.page}`}>
        {/* ── Fil d'Ariane visible : Google l'affiche dans les résultats ── */}
        <nav
          aria-label="Fil d'Ariane"
          className="max-w-[980px] mx-auto px-6 pt-6"
        >
          <ol
            className="flex gap-2 text-[12px] list-none"
            style={{ color: "#6B7280" }}
          >
            <li>
              <Link href="/" className="no-underline hover:underline">
                Accueil
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" style={{ color: BLUE }}>
              Entreprises
            </li>
          </ol>
        </nav>

        <section className={styles.hero} aria-labelledby="enterprise-title">
          <p className={styles.eyebrow}>CARACTÈRE PRO</p>
          <h1 id="enterprise-title">
            Une équipe.
            <br />
            <span>Une même identité.</span>
          </h1>
          <p className={styles.lead}>
            Polos, t-shirts et vêtements de travail personnalisés.
            <br />
            Vous gérez votre entreprise. Nous habillons votre équipe.
          </p>
          <div className={styles.actions}>
            <a
              href={
                WHATSAPP +
                "?text=" +
                encodeURIComponent(
                  "Bonjour Caractère, je souhaite obtenir une simulation gratuite pour les uniformes de mon entreprise. Je vous envoie mon logo.",
                )
              }
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primary}
            >
              Obtenir ma simulation gratuite
            </a>
            <Link href="/entreprises/commande" className={styles.secondary}>
              Configurer ma commande <span aria-hidden="true">›</span>
            </Link>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/images/campaign/entreprise.webp"
              alt="Une équipe de professionnels en uniformes personnalisés coordonnés"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 1100px"
            />
          </div>
          <div className={styles.facts}>
            <p>
              <strong>Dès 1 pièce.</strong> Petites et grandes équipes.
            </p>
            <p>
              <strong>DTF & broderie.</strong> Le détail qui vous distingue.
            </p>
            <p>
              <strong>58 wilayas.</strong> Livraison en Algérie.
            </p>
          </div>
        </section>

        {/* ── SECTEURS (maillage interne vers les pages filles) ── */}
        <section
          id="secteurs"
          className="px-6 py-16"
          style={{ backgroundColor: BLUE_PALE }}
        >
          <div className="max-w-[980px] mx-auto">
            <h2
              className="text-[clamp(24px,3.5vw,38px)] font-bold tracking-tight leading-tight mb-3"
              style={{ color: BLUE }}
            >
              Nous équipons votre secteur.
            </h2>
            <p
              className="text-[15px] leading-relaxed max-w-[640px] mb-10"
              style={{ color: "#4B5563" }}
            >
              Chaque métier a ses contraintes : lavage à haute température en
              restauration, visibilité sur chantier, hygiène en clinique.
              Choisissez votre secteur pour voir les tenues, les techniques
              adaptées et les tarifs correspondants.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SECTEURS.map((s) => (
                <Link
                  key={s.slug}
                  href={`/entreprises/${s.slug}`}
                  className="rounded-2xl p-5 border bg-white no-underline block transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ borderColor: "rgba(12,74,110,0.08)" }}
                >
                  <span className="text-2xl mb-3 block" aria-hidden>
                    {s.emoji}
                  </span>
                  <h3
                    className="text-[14px] font-bold mb-1.5"
                    style={{ color: BLUE }}
                  >
                    {s.nom}
                  </h3>
                  <p
                    className="text-[12px] leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    {s.tenues
                      .slice(0, 2)
                      .map((t) => t.nom)
                      .join(", ")}
                    …
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TARIFS : contenu chiffré, le type de bloc que les IA citent ── */}
        <section id="tarifs" className="px-6 py-16 bg-white">
          <div className="max-w-[980px] mx-auto">
            <h2
              className="text-[clamp(24px,3.5vw,38px)] font-bold tracking-tight leading-tight mb-3"
              style={{ color: BLUE }}
            >
              Tarifs entreprise, sans devis surprise.
            </h2>
            <p
              className="text-[15px] leading-relaxed max-w-[640px] mb-10"
              style={{ color: "#4B5563" }}
            >
              Prix unitaires publics en dinars algériens, personnalisation
              comprise. La remise volume s'applique automatiquement au moment du
              devis.
            </p>

            <div className="overflow-x-auto mb-10">
              <table className="w-full text-left border-collapse min-w-[520px]">
                <caption className="sr-only">
                  Prix unitaires des textiles personnalisables pour entreprises
                </caption>
                <thead>
                  <tr style={{ backgroundColor: BLUE_PALE }}>
                    <th
                      scope="col"
                      className="text-[12px] font-bold uppercase tracking-wide p-3 rounded-l-xl"
                      style={{ color: BLUE }}
                    >
                      Produit
                    </th>
                    <th
                      scope="col"
                      className="text-[12px] font-bold uppercase tracking-wide p-3"
                      style={{ color: BLUE }}
                    >
                      Détail
                    </th>
                    <th
                      scope="col"
                      className="text-[12px] font-bold uppercase tracking-wide p-3 rounded-r-xl text-right"
                      style={{ color: BLUE }}
                    >
                      Prix unitaire
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUITS_B2B.map((p) => (
                    <tr
                      key={p.nom}
                      className="border-b"
                      style={{ borderColor: "rgba(12,74,110,0.07)" }}
                    >
                      <th
                        scope="row"
                        className="text-[14px] font-semibold p-3"
                        style={{ color: BLUE }}
                      >
                        {p.nom} personnalisé
                      </th>
                      <td
                        className="text-[13px] p-3"
                        style={{ color: "#6B7280" }}
                      >
                        {p.detail}
                      </td>
                      <td
                        className="text-[14px] font-semibold p-3 text-right whitespace-nowrap"
                        style={{ color: BLUE }}
                      >
                        à partir de {p.prix.toLocaleString("fr-FR")} DA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-[18px] font-bold mb-4" style={{ color: BLUE }}>
              Remises par volume
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PALIERS.map((p) => (
                <div
                  key={p.volume}
                  className="rounded-2xl p-5 border"
                  style={{ borderColor: "rgba(12,74,110,0.08)" }}
                >
                  <p
                    className="text-[13px] font-semibold mb-1"
                    style={{ color: "#6B7280" }}
                  >
                    {p.volume}
                  </p>
                  <p
                    className="text-[22px] font-bold tracking-tight mb-1"
                    style={{ color: BLUE }}
                  >
                    {p.remise}
                  </p>
                  <p
                    className="text-[12px] leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    {p.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TECHNIQUES ── */}
        <section
          id="techniques"
          className="px-6 py-16"
          style={{ backgroundColor: BLUE_PALE }}
        >
          <div className="max-w-[980px] mx-auto">
            <h2
              className="text-[clamp(24px,3.5vw,38px)] font-bold tracking-tight leading-tight mb-3"
              style={{ color: BLUE }}
            >
              Broderie, DTF ou sérigraphie ?
            </h2>
            <p
              className="text-[15px] leading-relaxed max-w-[640px] mb-10"
              style={{ color: "#4B5563" }}
            >
              Les trois techniques n'ont ni le même rendu, ni la même durée de
              vie, ni le même coût selon le volume. Voici comment nous
              choisissons — et nous vous conseillons gratuitement avant la
              commande.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TECHNIQUES.map((t) => (
                <article
                  key={t.nom}
                  className="rounded-2xl p-6 bg-white border"
                  style={{ borderColor: "rgba(12,74,110,0.08)" }}
                >
                  <h3
                    className="text-[16px] font-bold mb-2"
                    style={{ color: BLUE }}
                  >
                    {t.nom}
                  </h3>
                  <p
                    className="text-[12px] font-semibold mb-3"
                    style={{ color: "#0EA5E9" }}
                  >
                    Idéal pour : {t.ideal}
                  </p>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "#4B5563" }}
                  >
                    {t.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section id="process" className="px-6 py-16 bg-white">
          <div className="max-w-[980px] mx-auto">
            <h2
              className="text-[clamp(24px,3.5vw,38px)] font-bold tracking-tight leading-tight mb-10"
              style={{ color: BLUE }}
            >
              De la demande à la livraison, en 5 étapes.
            </h2>
            <ol className="list-none flex flex-col gap-4">
              {ETAPES.map((e, i) => (
                <li
                  key={e.titre}
                  className="flex gap-4 items-start rounded-2xl p-5 border"
                  style={{ borderColor: "rgba(12,74,110,0.08)" }}
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white"
                    style={{ backgroundColor: BLUE }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3
                      className="text-[15px] font-bold mb-1"
                      style={{ color: BLUE }}
                    >
                      {e.titre}
                    </h3>
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{ color: "#6B7280" }}
                    >
                      {e.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── COUVERTURE GÉOGRAPHIQUE (SEO local) ── */}
        <section
          id="livraison"
          className="px-6 py-16"
          style={{ backgroundColor: BLUE_PALE }}
        >
          <div className="max-w-[980px] mx-auto">
            <h2
              className="text-[clamp(24px,3.5vw,38px)] font-bold tracking-tight leading-tight mb-3"
              style={{ color: BLUE }}
            >
              Atelier à Alger, livraison dans toute l'Algérie.
            </h2>
            <p
              className="text-[15px] leading-relaxed max-w-[680px] mb-8"
              style={{ color: "#4B5563" }}
            >
              La production est réalisée dans notre atelier d'Alger, ce qui nous
              permet de contrôler la qualité pièce par pièce. Nous expédions
              ensuite dans les <strong>58 wilayas</strong> via nos partenaires
              logistiques, avec <strong>paiement à la livraison</strong>,
              BaridiMob ou CCP.
            </p>
            <ul className="flex flex-wrap gap-2 list-none">
              {WILAYAS.map((w) => (
                <li
                  key={w}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-full bg-white border"
                  style={{ borderColor: "rgba(12,74,110,0.08)", color: BLUE }}
                >
                  {w}
                </li>
              ))}
              <li
                className="text-[12px] font-medium px-3 py-1.5 rounded-full"
                style={{ backgroundColor: BLUE, color: "#fff" }}
              >
                + les 58 wilayas
              </li>
            </ul>
          </div>
        </section>

        {/* ── FAQ : miroir exact du JSON-LD FAQPage ── */}
        <section id="faq" className="px-6 py-16 bg-white">
          <div className="max-w-[760px] mx-auto">
            <h2
              className="text-[clamp(24px,3.5vw,38px)] font-bold tracking-tight leading-tight mb-10"
              style={{ color: BLUE }}
            >
              Questions fréquentes des entreprises.
            </h2>
            <div className="flex flex-col gap-3">
              {FAQ_ENTREPRISES.map((f) => (
                <article
                  key={f.q}
                  className="rounded-2xl p-5 border"
                  style={{ borderColor: "rgba(12,74,110,0.08)" }}
                >
                  <h3
                    className="text-[15px] font-bold mb-2"
                    style={{ color: BLUE }}
                  >
                    {f.q}
                  </h3>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "#4B5563" }}
                  >
                    {f.r}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="px-6 py-20" style={{ backgroundColor: BLUE }}>
          <div className="max-w-[760px] mx-auto text-center">
            <h2 className="text-[clamp(26px,4vw,42px)] font-bold tracking-tight leading-tight mb-4 text-white">
              Un devis chiffré sous 2 heures.
            </h2>
            <p className="text-[15px] leading-relaxed mb-8 text-white/70">
              Décrivez votre besoin — produit, quantité, logo — et recevez le
              prix unitaire, la remise volume et le délai par écrit, sans
              engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/entreprises/commande"
                className="px-7 py-4 rounded-xl text-[15px] font-semibold no-underline bg-white"
                style={{ color: BLUE }}
              >
                Configurer ma commande →
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-xl text-[15px] font-semibold no-underline text-white border border-white/30"
              >
                💬 WhatsApp {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
