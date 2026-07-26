'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase'
import { useProtected } from '@/lib/hooks/useProtected'


const C = { black: '#0C0A09', white: '#FAFAF9', lime: '#A3E635', muted: '#A8A29E', line: 'rgba(250,250,249,.07)' }

export default function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [commandes, setCommandes] = useState<any[]>([])
  const [designs, setDesigns] = useState<any[]>([])
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      setUser(session.user)
      
      // Charger les commandes et designs (exemple)
      // En prod, il faut des tables Supabase pour les stocker
      setCommandes([
        { id: 1, design: 'Street Art Alger', date: '2026-01-15', statut: 'livré', prix: 1950 },
        { id: 2, design: 'Tech Vibes', date: '2026-01-18', statut: 'en production', prix: 1950 },
      ])

      setDesigns([
        { id: 1, name: 'Street Art Alger', created: '2026-01-10', used: 1 },
        { id: 2, name: 'Tech Vibes', created: '2026-01-15', used: 0 },
      ])

      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    router.push('/')
  }

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 100, color: C.white }}>⏳ Chargement...</div>

  const statuses: Record<string, { label: string; color: string }> = {
    'en production': { label: 'En production', color: C.lime },
    'livré': { label: 'Livré', color: '#10B981' },
    'annulé': { label: 'Annulé', color: '#EF4444' },
  }

  return (
    <div style={{ background: C.black, color: C.white, minHeight: '100vh' }}>
      <style>{`
        .dashboard-nav { display: flex; gap: 20px; border-bottom: 1px solid ${C.line}; padding: 20px 24px; }
        .nav-btn { background: none; border: none; color: ${C.muted}; cursor: pointer; font-weight: 700; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: all .2s; }
        .nav-btn.active { color: ${C.lime}; border-bottom-color: ${C.lime}; }
        .nav-btn:hover { color: ${C.white}; }
        .container { max-width: 1000px; margin: 0 auto; padding: 40px 24px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .card { background: rgba(250,250,249,.03); border: 1px solid ${C.line}; border-radius: 14px; padding: 24px; margin-bottom: 16px; }
        .stat { background: rgba(250,250,249,.03); border: 1px solid ${C.line}; border-radius: 14px; padding: 20px; text-align: center; }
        .stat-num { font-size: 28px; font-weight: 900; color: ${C.lime}; }
        .stat-label { font-size: 12px; color: ${C.muted}; text-transform: uppercase; margin-top: 6px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .btn-logout { background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.5); color: #EF4444; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 13px; transition: all .2s; }
        .btn-logout:hover { background: rgba(239,68,68,.2); }
        .status-badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
      `}</style>

      {/* Header */}
      <div className="header" style={{ padding: '20px 24px', borderBottom: `1px solid ${C.line}` }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Bienvenue, {user?.user_metadata?.full_name || 'Créateur'}</h1>
          <p style={{ color: C.muted, fontSize: 13, margin: '6px 0 0' }}>{user?.email}</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>🚪 Déconnexion</button>
      </div>

      {/* Navigation */}
      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${tab === 'overview' ? 'active' : ''}`}
          onClick={() => setTab('overview')}
        >
          📊 Vue d'ensemble
        </button>
        <button 
          className={`nav-btn ${tab === 'commandes' ? 'active' : ''}`}
          onClick={() => setTab('commandes')}
        >
          📦 Mes commandes ({commandes.length})
        </button>
        <button 
          className={`nav-btn ${tab === 'designs' ? 'active' : ''}`}
          onClick={() => setTab('designs')}
        >
          🎨 Mes designs ({designs.length})
        </button>
        <button 
          className={`nav-btn ${tab === 'profil' ? 'active' : ''}`}
          onClick={() => setTab('profil')}
        >
          👤 Profil
        </button>
      </div>

      <div className="container">
        {/* VUE D'ENSEMBLE */}
        {tab === 'overview' && (
          <>
            <div className="grid">
              <div className="stat">
                <div className="stat-num">{commandes.length}</div>
                <div className="stat-label">Commandes totales</div>
              </div>
              <div className="stat">
                <div className="stat-num">{designs.length}</div>
                <div className="stat-label">Designs créés</div>
              </div>
              <div className="stat">
                <div className="stat-num">{commandes.reduce((s, c) => s + c.prix, 0)}</div>
                <div className="stat-label">Dépenses totales (DA)</div>
              </div>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 900, margin: '40px 0 20px' }}>Dernières commandes</h2>
            {commandes.slice(0, 3).map(c => {
              const status = statuses[c.statut] || { label: c.statut, color: C.muted }
              return (
                <div key={c.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 800, margin: 0 }}>{c.design}</p>
                      <p style={{ color: C.muted, fontSize: 13, margin: '6px 0 0' }}>Commande #{c.id} • {c.date}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="status-badge" style={{ background: `rgba(163,230,53,.15)`, color: status.color }}>
                        {status.label}
                      </div>
                      <p style={{ fontWeight: 800, fontSize: 16, margin: '8px 0 0' }}>{c.prix} DA</p>
                    </div>
                  </div>
                </div>
              )
            })}

            <Link href="/designer" style={{
              display: 'inline-block',
              marginTop: 24,
              padding: '14px 28px',
              background: C.lime,
              color: C.black,
              textDecoration: 'none',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 14,
            }}>
              🎨 Créer un nouveau design
            </Link>
          </>
        )}

        {/* COMMANDES */}
        {tab === 'commandes' && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 24px' }}>Mes commandes</h2>
            {commandes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: C.muted }}>
                <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>Aucune commande pour l'instant</p>
                <Link href="/designer" style={{ color: C.lime, fontWeight: 800, textDecoration: 'none' }}>
                  Créer mon premier design →
                </Link>
              </div>
            ) : (
              commandes.map(c => {
                const status = statuses[c.statut] || { label: c.statut, color: C.muted }
                return (
                  <div key={c.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>{c.design}</p>
                        <p style={{ color: C.muted, fontSize: 13, margin: '6px 0 0' }}>Commande #{c.id} • {c.date}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="status-badge" style={{ background: `rgba(163,230,53,.15)`, color: status.color }}>
                          {status.label}
                        </div>
                        <p style={{ fontWeight: 900, fontSize: 18, margin: '8px 0 0', color: C.lime }}>{c.prix} DA</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </>
        )}

        {/* DESIGNS */}
        {tab === 'designs' && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 24px' }}>Mes designs</h2>
            {designs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: C.muted }}>
                <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>Aucun design sauvegardé</p>
                <Link href="/designer" style={{ color: C.lime, fontWeight: 800, textDecoration: 'none' }}>
                  Ouvrir le Designer →
                </Link>
              </div>
            ) : (
              designs.map(d => (
                <div key={d.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>{d.name}</p>
                      <p style={{ color: C.muted, fontSize: 13, margin: '6px 0 0' }}>Créé le {d.created} • Utilisé {d.used}x</p>
                    </div>
                    <Link href="/designer" style={{
                      padding: '8px 16px',
                      background: `rgba(163,230,53,.15)`,
                      color: C.lime,
                      textDecoration: 'none',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 13,
                    }}>
                      Modifier
                    </Link>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* PROFIL */}
        {tab === 'profil' && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 24px' }}>Mon profil</h2>
            <div className="card">
              <p style={{ color: C.muted, fontSize: 12, textTransform: 'uppercase', fontWeight: 800, margin: '0 0 8px' }}>Nom complet</p>
              <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{user?.user_metadata?.full_name || 'Non renseigné'}</p>
            </div>
            <div className="card">
              <p style={{ color: C.muted, fontSize: 12, textTransform: 'uppercase', fontWeight: 800, margin: '0 0 8px' }}>Email</p>
              <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{user?.email}</p>
            </div>
            <div className="card">
              <p style={{ color: C.muted, fontSize: 12, textTransform: 'uppercase', fontWeight: 800, margin: '0 0 8px' }}>Compte créé</p>
              <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>
            <button className="btn-logout" onClick={handleLogout} style={{ marginTop: 24, width: '100%', padding: 12 }}>
              🚪 Déconnexion
            </button>
          </>
        )}
      </div>
    </div>
  )
}
