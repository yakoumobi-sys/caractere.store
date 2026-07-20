'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const links = [
  { href: '/comment-ca-marche', label: 'Comment ça marche 🚀' },
  { href: '/produits', label: '🛍️ Produits' },  // ← BOLD & ICON
  { href: '/collection', label: '⭐ The Collection' },  // ← BOLD & ICON
  { href: '/configurateur', label: 'Configurer' },
  { href: '/#services', label: 'Services' },
  { href: '/#secteurs', label: 'Secteurs' },
  { href: '/#avis', label: 'Avis' },
  { href: '/#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end px-6 h-14 bg-transparent">
        <button
          className="flex flex-col gap-[5px] bg-transparent border-none p-1 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <span className="w-[22px] h-[2px] bg-[#0F0F0F] block" />
          <span className="w-[22px] h-[2px] bg-[#0F0F0F] block" />
          <span className="w-[22px] h-[2px] bg-[#0F0F0F] block" />
        </button>
      </nav>

      <div className={`mob-menu ${open ? 'open' : ''}`}>
        <button
          className="absolute top-4 right-5 bg-black/[0.06] border-none w-8 h-8 rounded-full text-base cursor-pointer flex items-center justify-center"
          onClick={() => setOpen(false)}
        >x</button>

        <Image
          src="https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-black-transparent.png"
          alt="Caractere Store"
          width={160}
          height={42}
          className="h-10 w-auto object-contain"
        />

        {links.map(l => (
          <a
            key={l.href}
            href={l.href}
            className="text-[26px] font-bold text-brand-dark no-underline tracking-tight"
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}

        {user ? (
          <>
            <Link href="/dashboard" className="text-[20px] font-bold text-brand-dark no-underline" onClick={() => setOpen(false)}>
              Mon compte
            </Link>
            <button onClick={() => { handleLogout(); setOpen(false) }} className="text-[16px] text-brand-gray underline bg-transparent border-none cursor-pointer">
              Déconnexion
            </button>
          </>
        ) : (
          <Link href="/auth/login" className="text-[20px] font-bold text-brand-dark no-underline" onClick={() => setOpen(false)}>
            Se connecter
          </Link>
        )}

        <Link
          href="/comment-ca-marche"
          className="bg-[#0C4A6E] text-white px-7 py-3.5 rounded-full text-[15px] font-bold no-underline text-center"
          onClick={() => setOpen(false)}
        >
          Comment ça marche 🚀
        </Link>

        <Link href="/configurateur" className="bg-brand-dark text-white px-7 py-3.5 rounded-full text-[15px] font-medium no-underline text-center" onClick={() => setOpen(false)}>
          Configurer ma commande
        </Link>
      </div>
    </>
  )
}
