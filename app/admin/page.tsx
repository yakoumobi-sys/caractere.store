import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 0

async function getStats() {
  const [commandesRes, produitsRes, leadsRes] = await Promise.all([
    supabaseAdmin.from('commandes').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('produits').select('*').eq('actif', true),
    supabaseAdmin.from('leads').select('id', { count: 'exact', head: true }),
  ])
  const commandes = commandesRes.data ?? []
  const total_ca = commandes.reduce((sum, c) => sum + (c.prix_total || 0), 0)
  const nouvelles = commandes.filter(c => c.statut === 'nouveau').length
  const en_cours = commandes.filter(c => c.statut === 'en_cours').length
  return {
    total_commandes: commandes.length,
    nouvelles,
    en_cours,
    total_ca,
    total_produits: produitsRes.data?.length ?? 0,
    total_leads: leadsRes.count ?? 0,
    dernieres: commandes.slice(0, 8),
  }
}

const STATUT_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  nouveau:  { label: 'Nouveau',  color: '#3B82F6', bg: '#EFF6FF' },
  en_cours: { label: 'En cours', color: '#F97316', bg: '#FFF7ED' },
  termine:  { label: 'Terminé',  color: '#10B981', bg: '#ECFDF5' },
  annule:   { label: 'Annulé',   color: '#EF4444', bg: '#FEF2F2' },
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      {/* Titre */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', letterSpacing: -0.3 }}>Dashboard</div>
        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Vue d'ensemble de Caractère Store</div>
      </div>

      {/* Bouton Résumé */}
      <Link href="/admin/resume" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: '100%', padding: '13px', borderRadius: 12,
        background: '#1E293B', color: '#fff',
        fontSize: 14, fontWeight: 700, textDecoration: 'none',
        marginBottom: 10, boxSizing: 'border-box',
      }}>
        📋 Résumé commandes — copie rapide
      </Link>

      {/* ── BOUTON MARKETING ── */}
      <Link href="/admin/marketing" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '13px 16px', borderRadius: 12,
        background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
        color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none',
        marginBottom: 16, boxSizing: 'border-box',
        boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
      }}>
        <span>📣 Marketing — Contacts & Campagnes</span>
        <span style={{
          background: 'rgba(255,255,255,0.25)', borderRadius: 20,
          padding: '2px 10px', fontSize: 12, fontWeight: 800,
        }}>
          {stats.total_leads} leads
        </span>
      </Link>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total commandes', value: stats.total_commandes, icon: '📦', color: '#1E293B' },
          { label: 'Nouvelles',       value: stats.nouvelles,       icon: '🆕', color: '#3B82F6' },
          { label: 'En cours',        value: stats.en_cours,        icon: '⚙️', color: '#F97316' },
          { label: 'CA total (DA)',   value: stats.total_ca.toLocaleString('fr-FR'), icon: '💰', color: '#10B981' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', borderRadius: 14, padding: '14px 16px',
            boxShadow: '0 1px 4px rgba(0,0,0,.07)',
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Dernières commandes */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,.07)', overflow: 'hidden' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 16px', borderBottom: '1px solid #F1F5F9',
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>Dernières commandes</span>
          <Link href="/admin/commandes" style={{ fontSize: 12, color: '#3B82F6', textDecoration: 'none', fontWeight: 600 }}>
            Voir tout →
          </Link>
        </div>

        {stats.dernieres.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
            Aucune commande pour l'instant
          </div>
        ) : (
          stats.dernieres.map((c: any) => {
            const s = STATUT_CONFIG[c.statut] ?? { label: c.statut, color: '#6B7280', bg: '#F9FAFB' }
            return (
              <div key={c.id} style={{
                padding: '12px 16px',
                borderBottom: '1px solid #F8FAFC',
                borderLeft: `3px solid ${s.color}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', fontFamily: 'monospace' }}>{c.reference}</div>
                  <div style={{ fontSize: 13, color: '#374151', marginTop: 1 }}>{c.nom_client}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{c.produit} · x{c.quantite}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{(c.prix_total || 0).toLocaleString('fr-FR')} DA</div>
                  <span style={{
                    display: 'inline-block', marginTop: 4,
                    background: s.bg, color: s.color,
                    padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                  }}>{s.label}</span>
                </div>
              </div>
            )
          })
        )}
      </div>

      <Link href="/admin/commandes" style={{
        display: 'block', textAlign: 'center',
        marginTop: 12, padding: '11px',
        borderRadius: 12, border: '1.5px solid #E2E8F0',
        background: '#fff', color: '#475569',
        fontSize: 13, fontWeight: 600, textDecoration: 'none',
      }}>
        Gérer toutes les commandes →
      </Link>
    </div>
  )
}
