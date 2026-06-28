'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import type { Commande } from '@/types'

const STATUT_STYLE: Record<Commande['statut'], { label: string; color: string }> = {
  nouveau:  { label: 'Reçue',         color: 'bg-amber-100 text-amber-800' },
  en_cours: { label: 'En production', color: 'bg-blue-100 text-blue-800'   },
  termine:  { label: 'Terminée',      color: 'bg-green-100 text-green-800' },
  annule:   { label: 'Annulée',       color: 'bg-red-100 text-red-800'     },
}

const C = {
  blue:   '#0C4A6E',
  blueLt: '#EFF6FF',
  gray1:  '#F0F7FF',
  gray2:  '#BAE6FD',
  gray4:  '#1E3A5F',
  black:  '#0C1A26',
  white:  '#FFFFFF',
  green:  '#16A34A',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth/login'); return }
      setUser(data.user)
      supabase
        .from('commandes')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
        .then(({ data: cmds }) => {
          setCommandes(cmds ?? [])
          setLoading(false)
        })
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-14 min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[13px] text-brand-gray">Chargement…</p>
          </div>
        </main>
      </>
    )
  }

  const prenom = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'vous'

  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen" style={{ background: '#F8FAFB' }}>

        {/* ── Hero compte ── */}
        <div style={{ background: `linear-gradient(150deg, #0C4A6E 0%, #0E5E8A 60%, #38BDF8 100%)` }}>
          <div className="max-w-[700px] mx-auto px-6 pt-8 pb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[12px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Bienvenue</p>
                <h1 className="text-[24px] font-black text-white tracking-tight">
                  {prenom} 👋
                </h1>
              </div>
              <button
                onClick={handleLogout}
                className="text-[12px] font-medium px-4 py-2 rounded-full border transition-all"
                style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)' }}
              >
                Déconnexion
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {[
                { label: 'Commandes',  value: commandes.length },
                { label: 'En cours',   value: commandes.filter(c => c.statut === 'en_cours').length },
                { label: 'Terminées',  value: commandes.filter(c => c.statut === 'termine').length },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-4 text-center"
                  style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)' }}>
                  <p className="text-[24px] font-black text-white leading-none">{s.value}</p>
                  <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs principaux */}
            <div className="flex gap-2.5">
              <Link href="/configurateur"
                className="flex-1 flex items-center justify-center py-3.5 rounded-full text-[14px] font-bold no-underline transition-all"
                style={{ background: C.white, color: C.blue, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                Configurer ma commande →
              </Link>
              <Link href="/designer"
                className="flex items-center justify-center px-5 py-3.5 rounded-full text-[14px] font-bold no-underline transition-all border-2"
                style={{ color: C.white, borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)' }}>
                Designer ✏️
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-[700px] mx-auto px-6 py-8 space-y-8">

          {/* ── Services ── */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: C.blue }}>Nos services</p>
            <div className="flex flex-col gap-2">
              {[
                { emoji: '🚀', title: 'Print on Demand', desc: 'Lancez votre marque sans stock ni abonnement.', href: '/designer', cta: 'Commencer à vendre' },
                { emoji: '🏢', title: 'Entreprises & B2B', desc: 'Uniformes et vêtements personnalisés pour votre équipe.', href: '/configurateur', cta: 'Configurer' },
                { emoji: '👕', title: 'Créez votre vêtement unique.', desc: '', href: '/produits', cta: 'Voir les produits' },
                { emoji: '✨', title: 'Collection Caractère', desc: 'Pièces premium prêtes à porter.', href: '/collection', cta: 'Découvrir' },
              ].map(card => (
                <Link key={card.title} href={card.href}
                  className="flex items-center justify-between px-5 py-4 rounded-2xl border no-underline hover:shadow-md transition-all bg-white"
                  style={{ borderColor: C.gray2 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px] flex-shrink-0"
                      style={{ background: C.gray1 }}>
                      {card.emoji}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold leading-tight" style={{ color: C.black }}>{card.title}</p>
                      {card.desc && <p className="text-[11px] mt-0.5" style={{ color: C.gray4 }}>{card.desc}</p>}
                    </div>
                  </div>
                  <span className="text-[12px] font-bold flex-shrink-0 ml-3" style={{ color: C.blue }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Accès rapides ── */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: C.blue }}>Accès rapides</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { emoji: '📦', label: 'Suivre ma commande', href: '/suivi' },
                { emoji: '📘', label: 'Catalogue PDF',       href: '/catalogue', target: '_blank' },
                { emoji: '💬', label: 'WhatsApp direct',     href: 'https://wa.me/213557440522', target: '_blank' },
                { emoji: '🔍', label: 'Nos produits',        href: '/produits' },
              ].map(item => (
                <a key={item.label} href={item.href} target={item.target}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border no-underline hover:shadow-sm transition-all"
                  style={{ borderColor: C.gray2 }}>
                  <span className="text-[18px]">{item.emoji}</span>
                  <p className="text-[13px] font-semibold" style={{ color: C.black }}>{item.label}</p>
                </a>
              ))}
            </div>
          </div>

          {/* ── Mes commandes ── */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: C.blue }}>Mes commandes</p>

            {commandes.length === 0 ? (
              <div className="text-center py-14 bg-white rounded-2xl border-2 border-dashed" style={{ borderColor: C.gray2 }}>
                <p className="text-[32px] mb-3">📦</p>
                <p className="text-[15px] font-bold mb-1" style={{ color: C.black }}>Aucune commande pour l'instant</p>
                <p className="text-[13px] mb-6" style={{ color: C.gray4 }}>
                  Commandez via le configurateur ou le designer
                </p>
                <Link href="/configurateur"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-bold no-underline"
                  style={{ background: C.blue, color: C.white }}>
                  Configurer ma première commande →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {commandes.map(cmd => (
                  <div key={cmd.id} className="bg-white border rounded-2xl p-5 hover:shadow-sm transition-all"
                    style={{ borderColor: C.gray2 }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-[13px] font-bold font-mono" style={{ color: C.black }}>{cmd.reference}</p>
                        <p className="text-[12px] mt-0.5" style={{ color: C.gray4 }}>
                          {cmd.produit} · {cmd.quantite} pièce{cmd.quantite > 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUT_STYLE[cmd.statut].color}`}>
                        {STATUT_STYLE[cmd.statut].label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] font-black" style={{ color: C.black }}>
                        {cmd.prix_total?.toLocaleString('fr-FR')} DA
                      </p>
                      <div className="flex gap-2">
                        {cmd.logo_url && (
                          <a href={cmd.logo_url} download
                            className="text-[12px] border px-3 py-1.5 rounded-full no-underline transition-all"
                            style={{ borderColor: C.gray2, color: C.black }}>
                            ↓ Design
                          </a>
                        )}
                        <Link href={`/suivi/${cmd.reference}`}
                          className="text-[12px] px-3 py-1.5 rounded-full no-underline"
                          style={{ background: C.blue, color: C.white }}>
                          Suivi →
                        </Link>
                      </div>
                    </div>
                    <p className="text-[11px] mt-2" style={{ color: C.gray4 }}>
                      {new Date(cmd.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  )
}
