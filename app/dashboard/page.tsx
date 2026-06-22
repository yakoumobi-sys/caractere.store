'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import type { Commande } from '@/types'

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-black-transparent.png'

const STATUT_STYLE: Record<Commande['statut'], { label: string; color: string }> = {
  nouveau:   { label: 'Reçue',          color: 'bg-amber-100 text-amber-800'  },
  en_cours:  { label: 'En production',  color: 'bg-blue-100 text-blue-800'    },
  termine:   { label: 'Terminée',       color: 'bg-green-100 text-green-800'  },
  annule:    { label: 'Annulée',        color: 'bg-red-100 text-red-800'      },
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
          <p className="text-brand-gray text-[14px]">Chargement…</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen bg-white">
        <div className="max-w-[700px] mx-auto px-6 py-12">

          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-[24px] font-bold text-brand-dark">Mon compte</h1>
              <p className="text-[13px] text-brand-gray mt-1">
                {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-[13px] text-brand-gray underline hover:text-brand-dark"
            >
              Déconnexion
            </button>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: 'Commandes', value: commandes.length },
              { label: 'En cours', value: commandes.filter(c => c.statut === 'en_cours').length },
              { label: 'Terminées', value: commandes.filter(c => c.statut === 'termine').length },
            ].map(s => (
              <div key={s.label} className="bg-brand-light rounded-2xl p-4 text-center">
                <p className="text-[22px] font-bold text-brand-dark">{s.value}</p>
                <p className="text-[11px] text-brand-gray mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Actions rapides */}
          <div className="flex gap-3 mb-10">
            <Link
              href="/configurateur"
              className="flex-1 text-center bg-brand-dark text-white px-4 py-3 rounded-full text-[13px] font-medium hover:bg-neutral-800 transition-colors no-underline"
            >
              Nouvelle commande
            </Link>
            <Link
              href="/designer"
              className="flex-1 text-center border border-black/15 text-brand-dark px-4 py-3 rounded-full text-[13px] font-medium hover:bg-brand-light transition-colors no-underline"
            >
              Open Designer
            </Link>
          </div>

          {/* Liste commandes */}
          <h2 className="text-[16px] font-semibold text-brand-dark mb-4">Mes commandes</h2>

          {commandes.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-black/10 rounded-2xl">
              <p className="text-[32px] mb-3">📦</p>
              <p className="text-[15px] font-medium text-brand-dark">Aucune commande pour l'instant</p>
              <p className="text-[13px] text-brand-gray mt-1 mb-6">
                Commandez via le configurateur ou le designer
              </p>
              <Link
                href="/configurateur"
                className="inline-block bg-brand-dark text-white px-6 py-2.5 rounded-full text-[13px] font-medium no-underline"
              >
                Commencer
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {commandes.map(cmd => (
                <div key={cmd.id} className="border border-black/10 rounded-2xl p-5 hover:border-black/20 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[13px] font-bold font-mono text-brand-dark">{cmd.reference}</p>
                      <p className="text-[13px] text-brand-gray mt-0.5">
                        {cmd.produit} · {cmd.quantite} pièce{cmd.quantite > 1 ? 's' : ''}
                      </p>
                    </div>
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUT_STYLE[cmd.statut].color}`}>
                      {STATUT_STYLE[cmd.statut].label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[15px] font-bold text-brand-dark">
                      {cmd.prix_total?.toLocaleString('fr-FR')} DA
                    </p>
                    <div className="flex gap-2">
                      {cmd.logo_url && (
                        <a
                          href={cmd.logo_url}
                          download
                          className="text-[12px] border border-black/15 px-3 py-1.5 rounded-full text-brand-dark hover:bg-brand-light transition-colors no-underline"
                        >
                          ↓ Design
                        </a>
                      )}
                      <Link
                        href={`/suivi/${cmd.reference}`}
                        className="text-[12px] bg-brand-dark text-white px-3 py-1.5 rounded-full hover:bg-neutral-800 transition-colors no-underline"
                      >
                        Suivi + paiement →
                      </Link>
                    </div>
                  </div>

                  <p className="text-[11px] text-brand-gray mt-2">
                    {new Date(cmd.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
