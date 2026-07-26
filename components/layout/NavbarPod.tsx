'use client'

import { useState } from 'react'
import Link from 'next/link'

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png'
const C = { black: '#0C0A09', white: '#FAFAF9', lime: '#A3E635', muted: '#A8A29E', line: 'rgba(250,250,249,.07)' }

export default function NavbarPoD() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(12,10,9,.92)',
      backdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${C.line}`,
      padding: '14px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <style>{`
        .nav-right { display: flex; gap: 12px; align-items: center; position: relative; }
        .btn-signup { background: ${C.lime}; color: ${C.black}; padding: 10px 18px; border-radius: 8px; font-weight: 800; font-size: 13px; text-decoration: none; transition: transform .25s; }
        .btn-signup:hover { transform: translateY(-2px); }
        .hamburger { background: none; border: none; color: ${C.white}; font-size: 24px; cursor: pointer; padding: 8px; display: flex; align-items: center; justify-content: center; }
        .menu-dropdown { position: absolute; top: 100%; right: 0; background: rgba(12,10,9,.98); backdrop-filter: blur(12px); border: 1px solid ${C.line}; border-top: none; border-radius: 0 0 12px 12px; min-width: 240px; padding: 12px 0; margin-top: -1px; }
        .menu-item { display: block; padding: 12px 20px; color: ${C.muted}; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all .2s ease; border-left: 2px solid transparent; }
        .menu-item:hover { color: ${C.white}; background: rgba(250,250,249,.05); border-left-color: ${C.lime}; }
        .menu-divider { height: 1px; background: ${C.line}; margin: 8px 0; }
      `}</style>

      <Link href="/"><img src={LOGO} alt="Caractère" style={{ height: 34, width: 'auto' }} /></Link>

      <div className="nav-right">
        <Link href="/auth/signup" className="btn-signup">📝 Créer un compte</Link>
        <Link href="/designer" style={{ color: C.lime, textDecoration: 'none', fontWeight: 800, fontSize: 13 }}>🎨 Créer</Link>
        
        <button 
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          ☰
        </button>

        {menuOpen && (
          <div className="menu-dropdown">
            <Link href="/comment-ca-marche" className="menu-item" onClick={() => setMenuOpen(false)}>Comment ça marche</Link>
            <Link href="/produits" className="menu-item" onClick={() => setMenuOpen(false)}>Produits</Link>
            <Link href="/collection" className="menu-item" onClick={() => setMenuOpen(false)}>Collection</Link>
            <div className="menu-divider" />
            <Link href="/auth/login" className="menu-item" onClick={() => setMenuOpen(false)}>Se connecter</Link>
            <a href="https://wa.me/213557440522" className="menu-item" onClick={() => setMenuOpen(false)}>💬 WhatsApp</a>
          </div>
        )}
      </div>
    </header>
  )
}
