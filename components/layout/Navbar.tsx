'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const links = [
  { href: '/#services', label: 'Services' },
  { href: '/#produits', label: 'Produits' },
  { href: '/#secteurs', label: 'Secteurs' },
  { href: '/#avis',     label: 'Avis'     },
  { href: '/#contact',  label: 'Contact'  },
  { href: '/designer',  label: 'Designer' },
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
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 bg-white/[0.88] backdrop-blur-xl border-b border-black/[0.08]">
        <Link href="/" className="flex items-center no-underline">
          <Image
            src="https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-black-transparent.png"
            alt="Caractère Store"
            width={140}
            height={36}
            className="h-9 w-auto object-contain"
          />
        </Link>

        <ul className="hidden md:flex gap-7 list-none items-center">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-[13px] text-brand-dark opacity-75 hover:opacity-100 transition-opacity no-underline">{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-[13px] font-medium text-brand-dark hover:opacity-75 transition-opacity no-underline"
              >
                Mon compte
              </Link>
              <Link
                href="/configurateur"
                className="bg-brand-dark text-white px-[18px] py-2 rounded-full text-[13px] font-medium hover:bg-neutral-800 transition-colors no-underline"
              >
                Configurer ma commande
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-[13px] font-medium text-brand-dark hover:opacity-75 transition-opacity no-underline"
              >
                Se connecter
              </Link>
              <Link
                href="/configurateur"
                className="bg-brand-dark text-white px-[18px] py-2 rounded-full text-[13px] font-medium hover:bg-neutral-800 transition-colors no-underline"
              >
                Configurer ma commande
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-[5px] bg-transparent border-none p-1 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <span className="w-[22px] h-[1.5px] bg-brand-dark block" />
          <span className="w-[22px] h-[1.5px] bg-brand-dark block" />
          <span className="w-[22px] h-[1.5px] bg-brand-dark block" />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`mob-menu ${open ? 'open' : ''}`}>
        <button
          className="absolute top-4 right-5 bg-black/[0.06] border-none w-8 h-8 rounded-full text-base cursor-pointer flex items-center justify-center"
          onClick={() => setOpen(false)}
        >x</button>

        <Image
          src="https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-black-transparent.png"
          alt="Caractère Store"
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
            <Link
              href="/dashboard"
              className="text-[20px] font-bold text-brand-dark no-underline"
              onClick={() => setOpen(false)}
            >
              Mon compte
            </Link>
            <button
              onClick={() => { handleLogout(); setOpen(false) }}
              className="text-[16px] text-brand-gray underline bg-transparent border-none cursor-pointer"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <Link
            href="/auth/login"
            className="text-[20px] font-bold text-brand-dark no-underline"
            onClick={() => setOpen(false)}
          >
            Se connecter
          </Link>
        )}

        <Link
          href="/configurateur"
          className="bg-brand-dark text-white px-7 py-3.5 rounded-full text-[15px] font-medium no-underline"
          onClick={() => setOpen(false)}
        >
          Configurer ma commande
        </Link>
      </div>
    </>
  )
}
