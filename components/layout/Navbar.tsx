'use client'

import { useState } from 'react'
import Link from 'next/link'

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
  { href: '/collection', label: 'Collection' },
  { href: '/produits', label: 'Produits' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,10,0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.line}`,
    }}>
      <style>{`
        .nav-link { color: ${C.gray}; text-decoration: none; font-weight: 700; font-size: 0.92rem; transition: color 0.2s ease; white-space: nowrap; }
        .nav-link:hover { color: ${C.white}; }
        .nav-inner { max-width: 1100px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; }
        .nav-left { display: flex; align-items: center; gap: 10px; }
        .nav-right { display: flex; align-items: center; gap: 14px; }
        .nav-login { color: ${C.white} !important; background: transparent; border: 1px solid ${C.line}; padding: 8px 16px; border-radius: 8px; font-weight: 700 !important; font-size: 0.9rem; transition: all 0.2s ease; text-decoration: none; }
        .nav-login:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }
        .hamburger { background: none; border: none; color: ${C.white}; font-size: 24px; cursor: pointer; padding: 8px; display: flex; align-items: center; justify-content: center; }
        .menu-dropdown { position: absolute; top: 100%; right: 0; background: rgba(10,10,10,0.98); backdrop-filter: blur(12px); border: 1px solid ${C.line}; border-top: none; border-radius: 0 0 12px 12px; min-width: 240px; padding: 12px 0; }
        .menu-item { display: block; padding: 12px 20px; color: ${C.gray}; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.2s ease; border-left: 2px solid transparent; }
        .menu-item:hover { color: ${C.white}; background: rgba(255,255,255,0.05); border-left-color: ${C.white}; }
        .menu-divider { height: 1px; background: ${C.line}; margin: 8px 0; }
      `}</style>

      <div className="nav-inner">
        {/* GAUCHE : Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: C.white, flexShrink: 0 }}>
          <LogoMini />
          <span style={{ fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>Caractère</span>
        </Link>

        {/* DROITE : Hamburger + Se connecter */}
        <div className="nav-right" style={{ position: 'relative' }}>
          <Link href="/auth/login" className="nav-login">
            Se connecter
          </Link>
          
          <button 
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            ☰
          </button>

          {/* MENU DROPDOWN */}
          {menuOpen && (
            <div className="menu-dropdown">
              {links.map((l, idx) => (
                <div key={l.href}>
                  <Link 
                    href={l.href} 
                    className="menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                  {idx === 2 && <div className="menu-divider" />}
                </div>
              ))}
              <div className="menu-divider" />
              <a 
                href="https://wa.me/213557440522" 
                className="menu-item"
                onClick={() => setMenuOpen(false)}
              >
                💬 WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
