'use client'
import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

const C = {
  blue:   '#0C4A6E',
  blueMid:'#1E6FA8',
  blueAcc:'#38BDF8',
  gray1:  '#F0F7FF',
  gray2:  '#BAE6FD',
  gray4:  '#1E3A5F',
  black:  '#0C1A26',
  white:  '#FFFFFF',
}

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)' } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = {
  n: string
  emoji: string
  tag: string
  title: string
  desc: string
  tips?: string[]
  cta?: { label: string; href: string }
  note?: string
}

// ─── Données des étapes ──────────────────────────────────────────────────────
const STEPS: Step[] = [
  {
    n: '01',
    emoji: '👤',
    tag: 'Démarrage',
    title: 'Créez votre compte gratuit',
    desc: "Inscrivez-vous sur mycaractere.xyz en 30 secondes. Aucun abonnement, aucune carte bancaire requise. Vous accédez immédiatement à tous les produits et au designer.",
    tips: [
      'Inscription gratuite et instantanée',
      'Aucun minimum de commande',
      'Accès au catalogue complet',
    ],
    cta: { label: 'Créer mon compte →', href: '/auth/register' },
  },
  {
    n: '02',
    emoji: '👕',
    tag: 'Produits',
    title: 'Choisissez votre produit',
    desc: "Parcourez notre catalogue : t-shirts, hoodies, polos, casquettes, totebags… Choisissez le modèle, la couleur et la taille. Tous nos produits sont disponibles en broderie ou impression DTF.",
    tips: [
      'T-shirt, Hoodie, Polo, Casquette…',
      'Plusieurs couleurs disponibles',
      'DTF ou broderie selon le produit',
    ],
    cta: { label: 'Voir les produits →', href: '/produits' },
  },
  {
    n: '03',
    emoji: '✏️',
    tag: 'Design',
    title: 'Créez votre design dans le Designer',
    desc: "Ouvrez le Designer et uploadez votre logo ou design. Important : utilisez une image PNG avec fond transparent pour un rendu propre sur le vêtement. Positionnez, redimensionnez, tournez votre design sur le mockup.",
    tips: [
      'PNG avec fond transparent obligatoire',
      'Glissez et déposez votre fichier',
      'Prévisualisation en temps réel sur le vêtement',
      'Redimensionnez et tournez librement',
    ],
    cta: { label: 'Ouvrir le Designer →', href: '/designer' },
    note: '💡 Pas de logo vectoriel ? Envoyez ce que vous avez — notre équipe vectorise gratuitement.',
  },
  {
    n: '04',
    emoji: '📥',
    tag: 'Mockup',
    title: 'Téléchargez l\'image du mockup',
    desc: "Une fois votre design positionné, faites une capture d'écran du mockup (ou téléchargez l'image si disponible). Cette image va servir à créer vos visuels produits pour vos réseaux sociaux.",
    tips: [
      'Capture d\'écran du vêtement avec votre design',
      'Fond neutre pour un rendu professionnel',
      'Préparez 2-3 angles si possible',
    ],
  },
  {
    n: '05',
    emoji: '🤖',
    tag: 'IA',
    title: 'Générez des photos avec un mannequin via l\'IA',
    desc: "Allez sur Google Gemini (gemini.google.com) ou tout autre générateur d'image IA. Uploadez votre mockup et demandez-lui de faire porter le vêtement à un mannequin dans une scène réaliste.",
    tips: [
      'Prompt recommandé : "Make this t-shirt worn by a young man standing in a clean studio, realistic photo, white background"',
      'Ou en français : "Fais porter ce t-shirt à un mannequin homme/femme en studio, photo réaliste"',
      'Variez les poses et les contextes',
      'Essayez aussi Ideogram.ai ou Adobe Firefly',
    ],
    note: '🎯 Résultat : des photos produits professionnelles sans shooting photo, sans mannequin, sans budget.',
  },
  {
    n: '06',
    emoji: '📱',
    tag: 'Marketing',
    title: 'Créez votre page Instagram et postez',
    desc: "Créez une page Instagram dédiée à votre marque. Postez vos photos générées par l'IA avec une belle description, des hashtags pertinents et le lien vers votre boutique ou WhatsApp.",
    tips: [
      'Nom de page = nom de votre marque',
      'Bio claire avec lien de commande',
      'Postez 3-5 photos au lancement',
      'Utilisez des hashtags niche (#vetementalgerie, #modealger…)',
      'Stories + Reels pour plus de portée',
    ],
  },
  {
    n: '07',
    emoji: '💰',
    tag: 'Publicité',
    title: 'Boostez avec Facebook Ads ou Marketplace',
    desc: "Deux options pour toucher vos premiers clients : boostez vos posts Instagram/Facebook avec un petit budget pub (500–1000 DA/jour), ou postez gratuitement sur Facebook Marketplace avec vos photos produits.",
    tips: [
      'Facebook Marketplace : gratuit, touche les acheteurs locaux',
      'Facebook Ads : budget dès 500 DA/jour, ciblage précis',
      'Ciblez : Algérie, 18-35 ans, intérêts mode/vêtements',
      'Testez avec un budget de 2000 DA pour commencer',
    ],
    note: '📊 Conseil : commencez par Marketplace gratuitement, puis investissez en pub dès la première vente.',
  },
  {
    n: '08',
    emoji: '🛍️',
    tag: 'Commande',
    title: 'Commande reçue ? Passez-la sur Caractère',
    desc: "Dès qu'un client vous passe commande, connectez-vous sur votre compte mycaractere.xyz et configurez la commande avec le produit, la couleur, la taille et le design. On imprime et on livre directement à votre client ou chez vous.",
    tips: [
      'Commande en quelques clics depuis votre dashboard',
      'Production en 48h à Alger',
      'Livraison nationale 3-5 jours',
      'Vous encaissez la différence entre votre prix de vente et le nôtre',
    ],
    cta: { label: 'Passer une commande →', href: '/configurateur' },
    note: '💡 Exemple : vous vendez un t-shirt 3 500 DA. Vous nous payez 1 950 DA. Vous gagnez 1 550 DA par pièce.',
  },
]

// ─── Composant StepCard ──────────────────────────────────────────────────────
function StepCard({ step, delay, isLast }: { step: Step; delay: number; isLast: boolean }) {
  const ref = useFadeIn(delay)
  return (
    <div ref={ref} className="relative flex gap-5">
      {/* Ligne verticale */}
      {!isLast && (
        <div className="absolute left-[23px] top-[52px] bottom-0 w-px" style={{ background: `linear-gradient(${C.gray2}, transparent)` }} />
      )}

      {/* Numéro */}
      <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-[13px] font-black z-10"
        style={{ background: C.blue, color: C.white, boxShadow: '0 4px 12px rgba(12,74,110,0.3)' }}>
        {step.n}
      </div>

      {/* Contenu */}
      <div className="flex-1 pb-10">
        {/* Tag */}
        <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3"
          style={{ background: C.gray1, color: C.blueMid }}>
          {step.tag}
        </span>

        {/* Titre */}
        <h2 className="text-[20px] font-black tracking-tight mb-2 flex items-center gap-2"
          style={{ color: C.black }}>
          <span>{step.emoji}</span> {step.title}
        </h2>

        {/* Description */}
        <p className="text-[14px] leading-relaxed mb-4" style={{ color: C.gray4 }}>
          {step.desc}
        </p>

        {/* Tips */}
        {step.tips && (
          <div className="rounded-2xl p-4 mb-4 space-y-2" style={{ background: C.gray1, border: `1px solid ${C.gray2}` }}>
            {step.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-[14px] flex-shrink-0 mt-0.5" style={{ color: C.blue }}>✓</span>
                <p className="text-[13px] leading-snug" style={{ color: C.black }}>{tip}</p>
              </div>
            ))}
          </div>
        )}

        {/* Note */}
        {step.note && (
          <div className="rounded-xl px-4 py-3 mb-4 text-[13px] leading-relaxed"
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }}>
            {step.note}
          </div>
        )}

        {/* CTA */}
        {step.cta && (
          <Link href={step.cta.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-bold no-underline transition-all hover:-translate-y-0.5"
            style={{ background: C.blue, color: C.white, boxShadow: '0 4px 12px rgba(12,74,110,0.25)' }}>
            {step.cta.label}
          </Link>
        )}
      </div>
    </div>
  )
}

// ─── Page principale ─────────────────────────────────────────────────────────
export default function CommentCaMarchePage() {
  const heroRef = useFadeIn(0)

  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen" style={{ background: '#F8FAFB' }}>

        {/* ── Hero ── */}
        <div style={{ background: `linear-gradient(150deg, #0C4A6E 0%, #0E5E8A 55%, #38BDF8 100%)` }}>
          <div className="max-w-[700px] mx-auto px-6 py-12 text-center" ref={heroRef}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold border mb-5"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#BAE6FD', borderColor: 'rgba(255,255,255,0.25)' }}>
              🚀 Print on Demand · Sans stock · Sans abonnement
            </span>

            <h1 className="text-[28px] font-black text-white tracking-tight mb-3"
              style={{ letterSpacing: '-0.025em' }}>
              Comment lancer votre marque<br />
              <span style={{ color: '#BAE6FD' }}>en 8 étapes simples.</span>
            </h1>

            <p className="text-[15px] mb-8 max-w-md mx-auto leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.75)' }}>
              De la création de compte à la première vente — un guide complet pour lancer votre marque de vêtements sans investissement initial.
            </p>

            {/* Résumé rapide */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {[
                { v: '0 DA', l: 'Investissement initial' },
                { v: '48h', l: 'Délai de production' },
                { v: '100%', l: 'Fait en Algérie' },
              ].map(s => (
                <div key={s.l} className="rounded-xl py-3 px-2"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <p className="text-[18px] font-black text-white">{s.v}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Timeline des étapes ── */}
        <div className="max-w-[700px] mx-auto px-6 py-10">

          {/* Intro */}
          <div className="bg-white rounded-2xl p-5 mb-8 border" style={{ borderColor: C.gray2 }}>
            <p className="text-[13px] leading-relaxed" style={{ color: C.gray4 }}>
              <strong style={{ color: C.black }}>Le concept :</strong> vous créez des designs, vous les vendez via vos réseaux sociaux. Dès qu'un client achète, vous passez la commande chez nous. On produit et on livre. <strong style={{ color: C.black }}>Vous gardez la marge.</strong>
            </p>
          </div>

          {/* Steps */}
          <div>
            {STEPS.map((step, i) => (
              <StepCard
                key={step.n}
                step={step}
                delay={i * 50}
                isLast={i === STEPS.length - 1}
              />
            ))}
          </div>

          {/* ── CTA final ── */}
          <div className="rounded-[28px] p-8 text-center mt-4 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${C.black} 0%, #1a1a2e 100%)` }}>
            <div className="absolute pointer-events-none"
              style={{ top: -80, right: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <p className="text-[32px] mb-3">🎯</p>
              <h3 className="text-[20px] font-black text-white mb-2 tracking-tight">
                Prêt à lancer votre marque ?
              </h3>
              <p className="text-[13px] mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Créez votre compte gratuit et commencez maintenant.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/register"
                  className="px-7 py-3.5 rounded-full text-[14px] font-bold no-underline transition-all hover:-translate-y-0.5"
                  style={{ background: C.white, color: C.blue, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                  Créer mon compte gratuit →
                </Link>
                <a href="https://wa.me/213557440522" target="_blank" rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-full text-[14px] font-bold no-underline border-2 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  style={{ color: C.white, borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }}>
                  💬 Poser une question
                </a>
              </div>
            </div>
          </div>

          {/* FAQ rapide */}
          <div className="mt-8 space-y-3">
            <p className="text-[11px] font-bold tracking-widest uppercase mb-4" style={{ color: C.blue }}>
              Questions fréquentes
            </p>
            {[
              { q: 'C\'est quoi le Print on Demand ?', r: 'Vous vendez un vêtement avant de le produire. Dès qu\'une commande arrive, vous nous la transmettez et on imprime. Zéro stock, zéro risque.' },
              { q: 'Combien puis-je gagner par pièce ?', r: 'Vous fixez votre propre prix de vente. Si vous vendez un t-shirt à 3 500 DA et qu\'il vous coûte 1 950 DA chez nous, vous gagnez 1 550 DA de marge.' },
              { q: 'Faut-il un registre de commerce ?', r: 'Non, pas pour commencer. Vous pouvez lancer votre activité via vos réseaux sociaux sans formalités au départ.' },
              { q: 'Quelle qualité d\'impression ?', r: 'Impression DTF haute définition sur machines Epson I3200 professionnelles. Résistant au lavage, couleurs vives, fond transparent parfait.' },
              { q: 'Comment reçoit mon client sa commande ?', r: 'Livraison nationale via nos partenaires transport en 3-5 jours. Vous nous donnez l\'adresse de votre client et on livre directement.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border" style={{ borderColor: C.gray2 }}>
                <p className="text-[14px] font-bold mb-1.5" style={{ color: C.black }}>❓ {faq.q}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: C.gray4 }}>{faq.r}</p>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  )
}
