'use client'

import Link from 'next/link'

const C = {
  black: '#0A0A0A',
  white: '#FAFAFA',
  gray: '#A3A3A3',
  grayDark: '#525252',
  line: 'rgba(255,255,255,0.08)',
  navy: '#1A3A52',
  gold: '#D4A574',
  lime: '#A3E635',
  btsFrom: '#FF7A3D',
  btsTo: '#E63965',
}

const GATE_KEY = 'caractere_gate_seen'

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

function IconBriefcase({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <path d="M2 13h20" />
    </svg>
  )
}

function IconPrinter({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}

function IconBackpack({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2H8V4z" />
      <path d="M5 10a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-7z" />
      <path d="M9 9.5v3.5h6V9.5" />
      <path d="M9.5 16.5h5" />
    </svg>
  )
}

function IconCompass({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
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

export default function EntryGate({ onDismiss }: { onDismiss: () => void }) {
  const remember = () => {
    try { sessionStorage.setItem(GATE_KEY, '1') } catch {}
  }

  const handleContinue = () => {
    remember()
    onDismiss()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choisissez votre parcours"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: C.black,
        color: C.white,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        overflowY: 'auto',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gateIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gate-anim { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
        .gate-anim { animation: gateIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .gate-card {
          position: relative;
          display: flex; flex-direction: column; gap: 18px;
          background: linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02));
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid ${C.line};
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
          border-radius: 24px;
          padding: 36px 30px;
          text-decoration: none;
          color: ${C.white};
          overflow: hidden;
          text-align: left;
          font-family: inherit;
          cursor: pointer;
          transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .gate-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.14) 48%, transparent 65%);
          transform: translateX(-130%);
          transition: transform 0.9s cubic-bezier(0.22,1,0.36,1);
          pointer-events: none;
        }
        .gate-card:hover::before { transform: translateX(130%); }
        .gate-card:hover { transform: translateY(-4px); background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03)); box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 16px 40px rgba(0,0,0,0.4); }
        @media (prefers-reduced-motion: reduce) {
          .gate-card::before { display: none; }
        }
        .gate-card--entreprises:hover { border-color: ${C.gold}; }
        .gate-card--pod:hover { border-color: ${C.lime}; }
        .gate-card--continue:hover { border-color: rgba(255,255,255,0.4); }
        .gate-card-icon {
          width: 56px; height: 56px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          transition: background 0.25s ease, color 0.25s ease;
        }
        .gate-card--entreprises:hover .gate-card-icon { background: ${C.navy}; color: ${C.gold}; }
        .gate-card--pod:hover .gate-card-icon { background: rgba(163,230,53,0.15); color: ${C.lime}; }
        .gate-card--continue:hover .gate-card-icon { background: rgba(255,255,255,0.12); color: ${C.white}; }
        .gate-card-cta { display: inline-flex; align-items: center; gap: 6px; font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; color: ${C.gray}; transition: color 0.25s ease, gap 0.25s ease; }
        .gate-card:hover .gate-card-cta { gap: 10px; color: ${C.white}; }

        /* Carte "Back to School" — volontairement colorée pour trancher avec les autres */
        .gate-card--bts {
          background: linear-gradient(135deg, ${C.btsFrom}, ${C.btsTo});
          border-color: rgba(255,255,255,0.18);
        }
        .gate-card--bts .gate-card-icon { background: rgba(255,255,255,0.2); color: ${C.white}; }
        .gate-card--bts .gate-card-cta { color: rgba(255,255,255,0.85); }
        .gate-card--bts:hover { border-color: rgba(255,255,255,0.5); background: linear-gradient(135deg, ${C.btsFrom}, ${C.btsTo}); }
        .gate-card--bts:hover .gate-card-icon { background: rgba(255,255,255,0.3); color: ${C.white}; }
        .gate-card--bts:hover .gate-card-cta { color: ${C.white}; }
        .gate-card--bts .gate-badge {
          position: absolute; top: 18px; right: 18px;
          background: rgba(255,255,255,0.22); color: ${C.white};
          font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
          padding: 5px 10px; border-radius: 999px;
        }

        .gate-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; width: 100%; max-width: 1280px; }
        @media (max-width: 1100px) {
          .gate-grid { grid-template-columns: repeat(2, 1fr); max-width: 680px; }
        }
        @media (max-width: 560px) {
          .gate-grid { grid-template-columns: 1fr; max-width: 480px; }
        }
      `}} />

      <div className="gate-anim" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
        <Logo />
        <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>Caractère</span>
      </div>

      <h1
        className="gate-anim"
        style={{
          textAlign: 'center', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.12,
          fontSize: 'clamp(1.7rem, 5vw, 2.6rem)', margin: '0 0 12px', animationDelay: '0.05s',
        }}
      >
        Qu&rsquo;est-ce qui vous amène ?
      </h1>
      <p
        className="gate-anim"
        style={{
          textAlign: 'center', color: C.gray, fontWeight: 600, fontSize: '1.02rem',
          maxWidth: '480px', margin: '0 0 40px', animationDelay: '0.1s',
        }}
      >
        Choisissez votre parcours pour aller droit à l&rsquo;essentiel.
      </p>

      <div className="gate-anim gate-grid" style={{ animationDelay: '0.15s' }}>
        <Link href="/back-to-school" onClick={remember} className="gate-card gate-card--bts">
          <span className="gate-badge">Nouveau</span>
          <span className="gate-card-icon"><IconBackpack /></span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.01em', marginBottom: '8px' }}>Back to School</div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.5 }}>
              Tepyach pour la rentrée, pack et promotion.
            </div>
          </div>
          <span className="gate-card-cta">Voir l&rsquo;offre <IconArrow /></span>
        </Link>

        <Link href="/entreprises" onClick={remember} className="gate-card gate-card--entreprises">
          <span className="gate-card-icon"><IconBriefcase /></span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.01em', marginBottom: '8px' }}>Entreprises</div>
            <div style={{ color: C.gray, fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.5 }}>
              Uniformes, broderie, DTF — habillez votre équipe en 48h.
            </div>
          </div>
          <span className="gate-card-cta">Découvrir <IconArrow /></span>
        </Link>

        <Link href="/print-on-demand" onClick={remember} className="gate-card gate-card--pod">
          <span className="gate-card-icon"><IconPrinter /></span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.01em', marginBottom: '8px' }}>Print on Demand</div>
            <div style={{ color: C.gray, fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.5 }}>
              Lancez votre marque de vêtements, sans stock, sans risque.
            </div>
          </div>
          <span className="gate-card-cta">Découvrir <IconArrow /></span>
        </Link>

        <button type="button" onClick={handleContinue} className="gate-card gate-card--continue">
          <span className="gate-card-icon"><IconCompass /></span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.01em', marginBottom: '8px' }}>Explorer le site</div>
            <div style={{ color: C.gray, fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.5 }}>
              Produits, designer, configurateur — tout voir avant de choisir.
            </div>
          </div>
          <span className="gate-card-cta">Continuer <IconArrow /></span>
        </button>
      </div>
    </div>
  )
}
