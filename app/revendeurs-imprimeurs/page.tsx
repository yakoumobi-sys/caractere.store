import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { JsonLd, SITE_URL, WHATSAPP } from '@/lib/seo'

const path = '/revendeurs-imprimeurs'
const url = `${SITE_URL}${path}`
const title = "Fournisseur textile et DTF pour ateliers d'impression en Algérie"
const description = "Caractère accompagne les ateliers d'impression, revendeurs textile et créateurs en Algérie : textiles vierges, DTF, broderie et production personnalisée. Demandez un devis professionnel."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title, description, url, siteName: 'Caractère Store',
    type: 'website', locale: 'fr_DZ',
  },
}

const faq = [
  {
    question: 'Caractère fournit-il des t-shirts et polos vierges aux ateliers ?',
    answer: "Oui. Les ateliers et revendeurs peuvent demander des textiles vierges pour leurs projets d'impression. Les modèles, tailles, couleurs, quantités et stocks sont confirmés au devis.",
  },
  {
    question: "Peut-on confier l'impression DTF ou la broderie à Caractère ?",
    answer: "Caractère propose des services de personnalisation DTF et de broderie. Envoyez le visuel, les supports, les quantités et les délais souhaités pour vérifier la faisabilité.",
  },
  {
    question: "Quels sont les tarifs revendeur ?",
    answer: "Les prix professionnels dépendent du textile, du volume, de la technique et des contraintes de production. Une proposition personnalisée est établie sur demande.",
  },
  {
    question: "La livraison est-elle possible hors d'Alger ?",
    answer: "Oui. Caractère travaille depuis Alger et expédie des commandes dans les wilayas d'Algérie selon les modalités convenues au devis.",
  },
]

const data = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: 'fr-DZ',
    },
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: "Fourniture textile et services d'impression pour ateliers et revendeurs",
      serviceType: "Fourniture de textiles vierges, impression DTF, broderie et production personnalisée B2B",
      provider: { '@id': `${SITE_URL}/#localbusiness` },
      areaServed: { '@type': 'Country', name: 'Algérie' },
      audience: {
        '@type': 'BusinessAudience',
        audienceType: "Revendeurs textiles, ateliers DTF, imprimeurs et créateurs de marques",
      },
      url,
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

export default function RevendeursImprimeursPage() {
  const message = encodeURIComponent(
    "Bonjour Caractère. Je suis revendeur ou imprimeur professionnel. Je cherche un fournisseur de textiles ou une prestation DTF/broderie. Pouvez-vous m'envoyer un devis B2B ?",
  )
  return (
    <>
      <JsonLd data={data} />
      <Navbar />
      <main className="bg-white text-[#1d1d1f]">
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-20">
          <p className="mb-6 text-xs font-bold uppercase tracking-[.2em] text-neutral-500">CARACTÈRE · PARTENAIRES PRO</p>
          <h1 className="max-w-4xl text-[clamp(36px,6vw,76px)] font-bold leading-[1.04] tracking-tight">
            Votre atelier imprime. <span className="text-neutral-500">Nous vous aidons à produire.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-neutral-600">
            Fournisseur textile et partenaire de production pour les ateliers d’impression, les revendeurs et les marques en Algérie. Textiles vierges, impression DTF et broderie : décrivez votre projet, nous préparons une réponse adaptée.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a className="rounded-full bg-black px-7 py-4 font-semibold text-white" href={`${WHATSAPP}?text=${message}`} target="_blank" rel="noopener noreferrer">Demander un devis revendeur</a>
            <Link className="rounded-full border border-neutral-300 px-7 py-4 font-semibold" href="/print-on-demand">Découvrir le print on demand</Link>
          </div>
          <p className="mt-5 text-sm text-neutral-500">Atelier à Alger · Livraison en Algérie · Tarifs sur devis professionnel</p>
        </section>
        <section className="bg-[#f5f5f7] px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold tracking-tight">Un partenaire pour vos commandes</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                { title: 'Textiles vierges', text: 'T-shirts, polos et supports à personnaliser. Demandez la disponibilité de vos tailles, couleurs et quantités.' },
                { title: 'DTF et broderie', text: 'Confiez-nous une étape de production à partir de vos visuels et de votre cahier des charges.' },
                { title: 'Production pour marques', text: 'Préparez une collection ou une commande client sans multiplier les interlocuteurs.' },
              ].map((service) => (
                <article key={service.title} className="rounded-2xl bg-white p-7">
                  <h3 className="mb-4 text-xl font-bold">{service.title}</h3>
                  <p className="leading-relaxed text-neutral-600">{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight">Comment obtenir votre devis B2B ?</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            <li><strong>1. Votre besoin</strong><p className="mt-2 text-neutral-600">Produit, tailles, couleurs, quantité et éventuel logo.</p></li>
            <li><strong>2. Vérification</strong><p className="mt-2 text-neutral-600">Notre équipe confirme la faisabilité, le stock et les délais.</p></li>
            <li><strong>3. Offre personnalisée</strong><p className="mt-2 text-neutral-600">Recevez les conditions et le devis avant de lancer la production.</p></li>
          </ol>
          <a className="mt-9 inline-block rounded-full bg-black px-7 py-4 font-semibold text-white" href={`${WHATSAPP}?text=${message}`} target="_blank" rel="noopener noreferrer">Envoyer mon projet sur WhatsApp</a>
        </section>
        <section className="bg-[#f5f5f7] px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold tracking-tight">Questions des ateliers et revendeurs</h2>
            {faq.map((item) => (
              <details key={item.question} className="border-b border-neutral-300 py-5">
                <summary className="cursor-pointer font-semibold">{item.question}</summary>
                <p className="pt-4 leading-relaxed text-neutral-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
