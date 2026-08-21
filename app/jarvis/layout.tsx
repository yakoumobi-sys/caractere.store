'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const navItems = [
  { href: '/jarvis',           icon: '◎', label: 'Aujourd\'hui' },
  { href: '/jarvis/agenda',    icon: '▤', label: 'Agenda'       },
  { href: '/jarvis/finances',  icon: '◈', label: 'Finances'     },
  { href: '/jarvis/objectifs', icon: '◆', label: 'Objectifs'    },
  { href: '/jarvis/chat',      icon: '✦', label: 'JARVIS'       },
]

export default function JarvisLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push(`/auth/login?next=${pathname}`)
        return
      }
      setUser(session.user)
      setIsLoading(false)
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/auth/login')
      else setUser(session.user)
    })
    return () => subscription?.unsubscribe()
  }, [router, pathname])

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#05070C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, margin: '0 auto 14px',
            border: '2px solid rgba(34,211,238,0.15)', borderTopColor: '#22D3EE',
            borderRadius: '50%', animation: 'jarvis-spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 }}>Initialisation de JARVIS…</p>
        </div>
        <style>{`@keyframes jarvis-spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  const prenom = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || ''

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse 120% 60% at 50% -10%, rgba(34,211,238,0.14), transparent 55%), radial-gradient(ellipse 100% 50% at 100% 100%, rgba(139,92,246,0.10), transparent 60%), #05070C',
        color: '#fff',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
      }}
    >
      {/* Topbar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px',
        paddingTop: 'max(14px, env(safe-area-inset-top))',
        background: 'rgba(5,7,12,0.72)', backdropFilter: 'blur(18px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'linear-gradient(135deg, #22D3EE, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: '#05070C',
          }}>J</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.2 }}>JARVIS</div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>{prenom ? `Bonjour, ${prenom}` : 'Second cerveau'}</div>
          </div>
        </div>
        <Link href="/admin" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
          Boutique →
        </Link>
      </header>

      {/* Nav desktop */}
      <nav className="hidden md:flex" style={{
        gap: 4, padding: '10px 18px 0', maxWidth: 880, margin: '0 auto',
      }}>
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 14px', borderRadius: 10, textDecoration: 'none',
              fontSize: 12.5, fontWeight: 600,
              color: active ? '#05070C' : 'rgba(255,255,255,0.55)',
              background: active ? 'linear-gradient(135deg, #22D3EE, #67e8f9)' : 'transparent',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 13 }}>{item.icon}</span>{item.label}
            </Link>
          )
        })}
      </nav>

      {/* Contenu */}
      <main style={{ maxWidth: 880, margin: '0 auto', padding: '18px 16px 100px' }}>
        {children}
      </main>

      {/* Tab bar mobile (style iOS) */}
      <nav className="md:hidden" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'space-around',
        padding: '8px 4px', paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        background: 'rgba(8,10,16,0.82)', backdropFilter: 'blur(22px) saturate(180%)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '4px 10px', borderRadius: 10, textDecoration: 'none',
              color: active ? '#22D3EE' : 'rgba(255,255,255,0.4)',
              minWidth: 56,
            }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: 0.2 }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
