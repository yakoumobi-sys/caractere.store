'use client'

import Link from 'next/link'

// ============================================
// CARACTÈRE — NAVBAR V5 "NOIR"
// Tarifs + Avis remplacés par Designer + Studio 3D
// Deploy to: components/layout/Navbar.tsx
// ============================================

const C = {
  black: '#0A0A0A',
  white: '#FAFAFA',
  gray: '#A3A3A3',
  line: 'rgba(255,255,255,0.08)',
}

function LogoMini({ size = 34 }: { size?: number }) {
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

const links = [
  { href: '/outils', label: 'Outils' },
  { href: '/designer', label: 'Designer' },
  { href: '/studio-3d', label: 'Studio 3D' },
]

export default function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,10,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.line}`,
    }}>
      <style>{`
        .nav-link { color: ${C.gray}; text-decoration: none; font-weight: 700; font-size: 0.92rem; transition: color 0.2s ease; white-space: nowrap; }
        .nav-link:hover { color: ${C.white}; }
        .nav-inner { max-width: 1100px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .nav-links { display: flex; align-items: center; gap: 22px; overflow-x: auto; scrollbar-width: none; }
        .nav-links::-webkit-scrollbar { display: none; }
        .nav-wa { color: ${C.black} !important; background: ${C.white}; padding: 8px 16px; border-radius: 999px; font-weight: 800 !important; transition: opacity 0.2s ease; }
        .nav-wa:hover { opacity: 0.85; color: ${C.black} !important; }
        @media (max-width: 480px) {
          .nav-links { gap: 16px; }
          .nav-link { font-size: 0.85rem; }
          .nav-wa { padding: 7px 13px; }
        }
      `}</style>
      <div className="nav-inner">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: C.white, flexShrink: 0 }}>
          <LogoMini />
          <span style={{ fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>Caractère</span>
        </Link>
        <div className="nav-links">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
          ))}
          <a href="https://wa.me/213557440522" className="nav-link nav-wa">WhatsApp</a>
        </div>
      </div>
    </nav>
  )
}
