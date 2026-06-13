'use client'
import { useState } from 'react'
import Link from 'next/link'

const links = [
  { href: '/#services', label: 'Services' },
  { href: '/#produits', label: 'Produits' },
  { href: '/#secteurs', label: 'Secteurs' },
  { href: '/#avis',     label: 'Avis'     },
  { href: '/#contact',  label: 'Contact'  },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-11 h-14 bg-white/[0.88] backdrop-blur-xl border-b border-black/[0.08]">
        <Link href="/" className="text-[15px] font-bold tracking-tight text-brand-dark no-underline">Caractère Store</Link>
        <ul className="hidden md:flex gap-7 list-none items-center">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-[13px] text-brand-dark opacity-75 hover:opacity-100 transition-opacity no-underline">{l.label}</a>
            </li>
          ))}
        </ul>
        <Link href="/configurateur" className="hidden md:inline-flex bg-brand-dark text-white px-[18px] py-2 rounded-full text-[13px] font-medium hover:bg-neutral-800 transition-colors no-underline">
          Configurer ma commande
        </Link>
        <button className="md:hidden flex flex-col gap-[5px] bg-transparent border-none p-1 cursor-pointer" onClick={() => setOpen(true)}>
          <span className="w-[22px] h-[1.5px] bg-brand-dark block" />
          <span className="w-[22px] h-[1.5px] bg-brand-dark block" />
          <span className="w-[22px] h-[1.5px] bg-brand-dark block" />
        </button>
      </nav>
      <div className={`mob-menu ${open ? 'open' : ''}`}>
        <button className="absolute top-4 right-5 bg-black/[0.06] border-none w-8 h-8 rounded-full text-base cursor-pointer flex items-center justify-center" onClick={() => setOpen(false)}>✕</button>
        {links.map(l => (
          <a key={l.href} href={l.href} className="text-[26px] font-bold text-brand-dark no-underline tracking-tight" onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <Link href="/configurateur" className="bg-brand-dark text-white px-7 py-3.5 rounded-full text-[15px] font-medium no-underline" onClick={() => setOpen(false)}>
          Configurer ma commande
        </Link>
      </div>
    </>
  )
}
