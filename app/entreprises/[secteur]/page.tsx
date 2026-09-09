import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  JsonLd, SITE_URL, SITE_NAME, LOGO_URL, WHATSAPP, PHONE_DISPLAY,
  jsonLdGraph, breadcrumbLd, faqLd,
} from '@/lib/seo'
import { SECTEURS, getSecteur, PALIERS } from '@/lib/entreprises-data'

// Les pages secteur sont un ensemble fermé et connu à la compilation :
// on les pré-rend toutes et on renvoie un 404 pour tout autre segment, plutôt
// que de laisser Next générer des URL vides qui diluent l'indexation.
export const dynamicParams = false

export function generateStaticParams() {
  return SECTEURS.map(s => ({ secteur: s.slug }))
}

export function generateMetadata({ params }: { params: { secteur: string } }): Metadata {
  const s = getSecteur(params.secteur)
  if (!s) return {}

  const path = `/entreprises/${s.slug}`
  return {
    title: s.title,
    description: s.description,
    keywords: s.motsCles,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}${path}`,
      title: s.title,
      description: s.description,
      siteName: SITE_NAME,
      locale: 'fr_DZ',
      images: [{ url: LOGO_URL, alt: `${s.nom} — ${SITE_NAME}` }],
    },
    twitter: { card: 'summary_large_image', title: s.title, description: s.description, images: [LOGO_URL] },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
  }
}

const BLUE = '#0C4A6E'
const BLUE_PALE = '#F0F9FF'

export default function SecteurPage({ params }: { params: { secteur: string } }) {
  const s = getSecteur(params.secteur)
  if (!s) notFound()

  const path = `/entreprises/${s.slug}`
  const url = `${SITE_URL}${path}`
  const autres = SECTEURS.filter(x => x.slug !== s.slug)

  const structuredData = jsonLdGraph(
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: s.title,
      description: s.description,
      inLanguage: 'fr-DZ',
      isPartOf: { '@id': `${SITE_URL}/#organization` },
      about: { '@id': `${SITE_URL}/#localbusiness` },
    },
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: s.h1,
      serviceType: `Personnalisation textile — ${s.nom}`,
      description: s.intro,
      provider: { '@id': `${SITE_URL}/#localbusiness` },
      areaServed: { '@type': 'Country', name: 'Algérie' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `Tenues ${s.nom}`,
        itemListElement: s.tenues.map(t => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Product', name: t.nom, description: t.detail },
          priceCurrency: 'DZD',
          availability: 'https://schema.org/InStock',
        })),
      },
    },
    faqLd(s.faq),
    breadcrumbLd([
      { name: 'Accueil', path: '/' },
      { name: 'Entreprises', path: '/entreprises' },
      { name: s.nom, path },
    ]),
  )

  return (
    <>
      <JsonLd data={structuredData} />
      <Navbar />

      <main className="pt-14 bg-white">

        <nav aria-label="Fil d'Ariane" className="max-w-[880px] mx-auto px-6 pt-6">
          <ol className="flex flex-wrap gap-2 text-[12px] list-none" style={{ color: '#6B7280' }}>
            <li><Link href="/" className="no-underline hover:underline">Accueil</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/entreprises" className="no-underline hover:underline">Entreprises</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" style={{ color: BLUE }}>{s.nom}</li>
          </ol>
        </nav>

        {/* ── HERO ── */}
        <section className="px-6 pt-10 pb-14">
          <div className="max-w-[880px] mx-auto">
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: BLUE_PALE, color: BLUE }}>
              <span aria-hidden>{s.emoji}</span> {s.nom}
            </span>
            <h1 className="text-[clamp(28px,4.5vw,48px)] font-bold tracking-tight leading-[1.06] mb-5" style={{ color: BLUE }}>
              {s.h1}
            </h1>
            <p className="text-[16px] leading-relaxed max-w-[680px] mb-8" style={{ color: '#4B5563' }}>
              {s.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/entreprises/commande"
                className="px-7 py-4 rounded-xl text-[15px] font-semibold text-white no-underline text-center"
                style={{ backgroundColor: BLUE }}>
                Demander un devis →
              </Link>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                className="px-7 py-4 rounded-xl text-[15px] font-semibold no-underline text-center border"
                style={{ borderColor: 'rgba(12,74,110,0.2)', color: BLUE }}>
                💬 WhatsApp {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        {/* ── TENUES ── */}
        <section className="px-6 py-14" style={{ backgroundColor: BLUE_PALE }}>
          <div className="max-w-[880px] mx-auto">
            <h2 className="text-[clamp(22px,3.2vw,34px)] font-bold tracking-tight leading-tight mb-8" style={{ color: BLUE }}>
              Les tenues que nous produisons pour ce secteur.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {s.tenues.map(t => (
                <article key={t.nom} className="rounded-2xl p-5 bg-white border" style={{ borderColor: 'rgba(12,74,110,0.08)' }}>
                  <h3 className="text-[15px] font-bold mb-1.5" style={{ color: BLUE }}>{t.nom}</h3>
                  <p className="text-[13px] leading-relaxed mb-3" style={{ color: '#6B7280' }}>{t.detail}</p>
                  <p className="text-[13px] font-semibold" style={{ color: '#0EA5E9' }}>{t.prix}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPÉCIFICITÉS ── */}
        <section className="px-6 py-14 bg-white">
          <div className="max-w-[880px] mx-auto">
            <h2 className="text-[clamp(22px,3.2vw,34px)] font-bold tracking-tight leading-tight mb-8" style={{ color: BLUE }}>
              Ce que ce secteur exige en plus.
            </h2>
            <ul className="list-none flex flex-col gap-3">
              {s.specificites.map(sp => (
                <li key={sp} className="flex gap-3 items-start rounded-2xl p-5 border" style={{ borderColor: 'rgba(12,74,110,0.08)' }}>
                  <span className="flex-shrink-0 mt-0.5" style={{ color: '#0EA5E9' }} aria-hidden>◆</span>
                  <p className="text-[14px] leading-relaxed" style={{ color: '#4B5563' }}>{sp}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── TARIFS VOLUME ── */}
        <section className="px-6 py-14" style={{ backgroundColor: BLUE_PALE }}>
          <div className="max-w-[880px] mx-auto">
            <h2 className="text-[clamp(22px,3.2vw,34px)] font-bold tracking-tight leading-tight mb-3" style={{ color: BLUE }}>
              Plus la série est grande, plus le prix unitaire baisse.
            </h2>
            <p className="text-[14px] leading-relaxed mb-8" style={{ color: '#4B5563' }}>
              Les remises s'appliquent automatiquement au devis, quel que soit le secteur.{' '}
              <Link href="/entreprises#tarifs" className="underline" style={{ color: BLUE }}>
                Voir la grille tarifaire complète
              </Link>.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {PALIERS.map(p => (
                <div key={p.volume} className="rounded-2xl p-5 bg-white border" style={{ borderColor: 'rgba(12,74,110,0.08)' }}>
                  <p className="text-[12px] font-semibold mb-1" style={{ color: '#6B7280' }}>{p.volume}</p>
                  <p className="text-[20px] font-bold tracking-tight" style={{ color: BLUE }}>{p.remise}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ SECTEUR ── */}
        <section className="px-6 py-14 bg-white">
          <div className="max-w-[760px] mx-auto">
            <h2 className="text-[clamp(22px,3.2vw,34px)] font-bold tracking-tight leading-tight mb-8" style={{ color: BLUE }}>
              Questions fréquentes — {s.nom}.
            </h2>
            <div className="flex flex-col gap-3">
              {s.faq.map(f => (
                <article key={f.q} className="rounded-2xl p-5 border" style={{ borderColor: 'rgba(12,74,110,0.08)' }}>
                  <h3 className="text-[15px] font-bold mb-2" style={{ color: BLUE }}>{f.q}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: '#4B5563' }}>{f.r}</p>
                </article>
              ))}
            </div>
            <p className="text-[13px] mt-6" style={{ color: '#6B7280' }}>
              D'autres questions ?{' '}
              <Link href="/entreprises#faq" className="underline" style={{ color: BLUE }}>
                Consultez la FAQ entreprises complète
              </Link>.
            </p>
          </div>
        </section>

        {/* ── MAILLAGE INTERNE VERS LES AUTRES SECTEURS ── */}
        <section className="px-6 py-14" style={{ backgroundColor: BLUE_PALE }}>
          <div className="max-w-[880px] mx-auto">
            <h2 className="text-[18px] font-bold mb-6" style={{ color: BLUE }}>Autres secteurs que nous équipons</h2>
            <div className="flex flex-wrap gap-2">
              {autres.map(a => (
                <Link key={a.slug} href={`/entreprises/${a.slug}`}
                  className="text-[13px] font-medium px-4 py-2 rounded-full bg-white border no-underline"
                  style={{ borderColor: 'rgba(12,74,110,0.08)', color: BLUE }}>
                  <span aria-hidden>{a.emoji}</span> {a.nom}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 py-16" style={{ backgroundColor: BLUE }}>
          <div className="max-w-[700px] mx-auto text-center">
            <h2 className="text-[clamp(24px,3.6vw,36px)] font-bold tracking-tight leading-tight mb-4 text-white">
              Équipons votre équipe.
            </h2>
            <p className="text-[15px] leading-relaxed mb-8 text-white/70">
              Devis chiffré sous 2 heures, production en 3 à 5 jours ouvrés, livraison dans les 58 wilayas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/entreprises/commande"
                className="px-7 py-4 rounded-xl text-[15px] font-semibold no-underline bg-white" style={{ color: BLUE }}>
                Configurer ma commande →
              </Link>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                className="px-7 py-4 rounded-xl text-[15px] font-semibold no-underline text-white border border-white/30">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
