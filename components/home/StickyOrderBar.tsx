'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const C = {
  black: '#0A0A0A',
  white: '#FAFAFA',
  line: 'rgba(255,255,255,0.08)',
}

function IconWhatsapp({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.47 14.38c-.29-.15-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.15-.2.29-.75.93-.92 1.12-.17.2-.34.22-.63.08-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.48.1-.2.05-.37-.02-.52-.08-.15-.65-1.57-.9-2.15-.24-.57-.48-.5-.65-.5-.17-.01-.37-.01-.56-.01-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.37-.07-.12-.27-.2-.56-.34z"/>
      <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.86.51 3.6 1.4 5.09L2 22l5.06-1.33A9.94 9.94 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2zm0 18.15c-1.7 0-3.28-.5-4.61-1.35l-.33-.2-3.01.79.8-2.93-.21-.34a8.14 8.14 0 0 1-1.26-4.36c0-4.5 3.66-8.15 8.16-8.15 4.5 0 8.15 3.66 8.15 8.15 0 4.5-3.66 8.15-8.16 8.15z"/>
    </svg>
  )
}

// Barre de commande fixe — mobile uniquement, apparaît après le hero pour ne
// pas dupliquer le CTA déjà visible au chargement. Masquée tant que
// l'EntryGate est ouvert (contrôlé par le parent via `hidden`).
export default function StickyOrderBar({ hidden }: { hidden: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const show = visible && !hidden

  return (
    <div
      className="sticky-order-bar"
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 90,
        background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderTop: `1px solid ${C.line}`,
        padding: '10px 16px', gap: '10px', alignItems: 'center',
        // display piloté uniquement par la classe .sticky-order-bar (media query
        // ci-dessous) — ne PAS mettre display ici, un style inline gagnerait
        // toujours sur la media query et afficherait la barre sur desktop aussi.
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <style>{`
        .sticky-order-bar { display: none; }
        @media (max-width: 767px) {
          .sticky-order-bar { display: flex; }
        }
      `}</style>
      <a
        href="https://wa.me/213557440522"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        style={{
          flexShrink: 0, width: '44px', height: '44px', borderRadius: '999px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${C.line}`, color: C.white,
        }}
      >
        <IconWhatsapp />
      </a>
      <Link
        href="/configurateur"
        style={{
          flex: 1, textAlign: 'center', background: C.white, color: C.black,
          padding: '13px 16px', borderRadius: '999px', fontWeight: 800, fontSize: '0.92rem',
          textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.03em',
        }}
      >
        Commander
      </Link>
    </div>
  )
}
