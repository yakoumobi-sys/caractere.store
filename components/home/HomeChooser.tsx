'use client'

import Link from 'next/link'

const C = {
  black: '#0A0A0A',
  white: '#FAFAFA',
  gray: '#A3A3A3',
  line: 'rgba(255,255,255,0.08)',
  navy: '#1A3A52',
  gold: '#D4A574',
  lime: '#A3E635',
  promoFrom: '#FF7A3D',
  promoTo: '#E63965',
}

function Logo({ size = 44 }) {
  return (
    <img
      src="https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png"
      alt="Caractère"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  )
}

function IconBriefcase({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <path d="M2 13h20" />
    </svg>
  )
}

function IconPrinter({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}

// Étiquette de prix : la promo, c'est d'abord une remise sur un article.
function IconTag({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
      <circle cx="7.5" cy="7.5" r="1.4" />
    </svg>
  )
}

function IconShirt({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M8.5 3 12 6l3.5-3L21 6l-2 4-2-1v12H7V9L5 10 3 6l5.5-3z" />
    </svg>
  )
}

function IconArrow({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  )
}

// Accueil du site : on ne vend rien ici, on aiguille. Quatre parcours, un choix,
// et le visiteur atterrit directement sur la page qui le concerne.
export default function HomeChooser() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.black,
        color: C.white,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 20px',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes chooserIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .choice-anim { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
        .choice-anim { animation: chooserIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }

        /* Tuile carrée : icône en haut, libellé calé en bas. */
        .choice-card {
          position: relative;
          aspect-ratio: 1 / 1;
          display: flex; flex-direction: column; justify-content: space-between;
          background: linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02));
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid ${C.line};
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
          border-radius: 22px;
          padding: 24px;
          text-decoration: none;
          color: ${C.white};
          overflow: hidden;
          text-align: left;
          transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .choice-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.14) 48%, transparent 65%);
          transform: translateX(-130%);
          transition: transform 0.9s cubic-bezier(0.22,1,0.36,1);
          pointer-events: none;
        }
        .choice-card:hover::before { transform: translateX(130%); }
        .choice-card:hover { transform: translateY(-4px); background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03)); box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 16px 40px rgba(0,0,0,0.4); }
        @media (prefers-reduced-motion: reduce) {
          .choice-card::before { display: none; }
          .choice-card:hover { transform: none; }
        }
        .choice-card--entreprises:hover { border-color: ${C.gold}; }
        .choice-card--pod:hover { border-color: ${C.lime}; }
        .choice-card--produits:hover { border-color: rgba(255,255,255,0.45); }

        .choice-card-icon {
          width: 52px; height: 52px; border-radius: 15px; flex: none;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          transition: background 0.25s ease, color 0.25s ease;
        }
        .choice-card--entreprises:hover .choice-card-icon { background: ${C.navy}; color: ${C.gold}; }
        .choice-card--pod:hover .choice-card-icon { background: rgba(163,230,53,0.15); color: ${C.lime}; }
        .choice-card--produits:hover .choice-card-icon { background: rgba(255,255,255,0.14); color: ${C.white}; }

        .choice-card-title { font-weight: 800; font-size: 1.18rem; letter-spacing: -0.01em; margin-bottom: 6px; }
        .choice-card-desc { color: ${C.gray}; font-weight: 500; font-size: 0.9rem; line-height: 1.45; }
        .choice-card-cta {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 14px;
          font-weight: 800; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.045em;
          color: ${C.gray}; transition: color 0.25s ease, gap 0.25s ease;
        }
        .choice-card:hover .choice-card-cta { gap: 10px; color: ${C.white}; }

        /* Promo : la seule tuile colorée, pour qu'elle tranche. */
        .choice-card--promo {
          background: linear-gradient(135deg, ${C.promoFrom}, ${C.promoTo});
          border-color: rgba(255,255,255,0.18);
        }
        .choice-card--promo .choice-card-icon { background: rgba(255,255,255,0.2); color: ${C.white}; }
        .choice-card--promo .choice-card-desc { color: rgba(255,255,255,0.88); }
        .choice-card--promo .choice-card-cta { color: rgba(255,255,255,0.85); }
        .choice-card--promo:hover { border-color: rgba(255,255,255,0.5); background: linear-gradient(135deg, ${C.promoFrom}, ${C.promoTo}); }
        .choice-card--promo:hover .choice-card-icon { background: rgba(255,255,255,0.3); }
        .choice-card--promo:hover .choice-card-cta { color: ${C.white}; }
        .choice-badge {
          position: absolute; top: 18px; right: 18px;
          background: rgba(255,255,255,0.22); color: ${C.white};
          font-size: 0.66rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
          padding: 5px 10px; border-radius: 999px;
        }

        .choice-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 580px;
        }
        /* Sur téléphone la tuile carrée n'a pas la place d'un descriptif :
           on garde icône + titre + action, qui suffisent à choisir. */
        @media (max-width: 560px) {
          .choice-card { padding: 16px; border-radius: 18px; }
          .choice-card-icon { width: 40px; height: 40px; border-radius: 12px; }
          .choice-card-title { font-size: 0.98rem; margin-bottom: 0; }
          .choice-card-desc { display: none; }
          .choice-card-cta { font-size: 0.66rem; margin-top: 8px; }
          .choice-badge { top: 12px; right: 12px; font-size: 0.58rem; padding: 4px 8px; }
          .choice-grid { gap: 12px; }
        }
      `}} />

      {/* `margin: auto` centre verticalement sans rogner le haut sur un écran court. */}
      <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div className="choice-anim" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '26px' }}>
          <Logo />
          <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>Caractère</span>
        </div>

        <h1
          className="choice-anim"
          style={{
            textAlign: 'center', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.12,
            fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', margin: '0 0 10px', animationDelay: '0.05s',
          }}
        >
          Qu&rsquo;est-ce qui vous amène ?
        </h1>
        <p
          className="choice-anim"
          style={{
            textAlign: 'center', color: C.gray, fontWeight: 600, fontSize: '0.98rem',
            maxWidth: '460px', margin: '0 0 32px', animationDelay: '0.1s',
          }}
        >
          Choisissez votre parcours pour aller droit à l&rsquo;essentiel.
        </p>

        <div className="choice-anim choice-grid" style={{ animationDelay: '0.15s' }}>
          <Link href="/entreprises" className="choice-card choice-card--entreprises">
            <span className="choice-card-icon"><IconBriefcase /></span>
            <div>
              <div className="choice-card-title">Uniformes entreprise</div>
              <div className="choice-card-desc">Habillez votre équipe — broderie, DTF, devis immédiat.</div>
              <span className="choice-card-cta">Configurer <IconArrow /></span>
            </div>
          </Link>

          <Link href="/print-on-demand" className="choice-card choice-card--pod">
            <span className="choice-card-icon"><IconPrinter /></span>
            <div>
              <div className="choice-card-title">Print on Demand</div>
              <div className="choice-card-desc">Lancez votre marque, sans stock et dès 1 pièce.</div>
              <span className="choice-card-cta">Découvrir <IconArrow /></span>
            </div>
          </Link>

          <Link href="/back-to-school" className="choice-card choice-card--promo">
            <span className="choice-badge">En cours</span>
            <span className="choice-card-icon"><IconTag /></span>
            <div>
              <div className="choice-card-title">Promo</div>
              <div className="choice-card-desc">Packs rentrée à prix cassé, jusqu&rsquo;à −35%.</div>
              <span className="choice-card-cta">Voir l&rsquo;offre <IconArrow /></span>
            </div>
          </Link>

          <Link href="/produits" className="choice-card choice-card--produits">
            <span className="choice-card-icon"><IconShirt /></span>
            <div>
              <div className="choice-card-title">Produits</div>
              <div className="choice-card-desc">T-shirts, polos, hoodies, casquettes et accessoires.</div>
              <span className="choice-card-cta">Parcourir <IconArrow /></span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
