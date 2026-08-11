'use client'
import { useEffect, useState } from 'react'
import type { Avis } from '@/types'
import { adminFetch } from '@/lib/adminFetch'

const STATUTS = ['en_attente', 'approuve', 'rejete']

const STATUT_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  en_attente: { label: 'En attente', color: '#C2410C', bg: '#FFF7ED', dot: '#F97316' },
  approuve:   { label: 'Approuvé',   color: '#15803D', bg: '#F0FDF4', dot: '#22C55E' },
  rejete:     { label: 'Rejeté',     color: '#B91C1C', bg: '#FEF2F2', dot: '#EF4444' },
}

function Stars({ note }: { note: number }) {
  return (
    <span style={{ color: '#F5A623', fontSize: '13px' }}>
      {'★'.repeat(note)}{'☆'.repeat(5 - note)}
    </span>
  )
}

export default function AvisAdmin() {
  const [avis, setAvis] = useState<Avis[]>([])
  const [filter, setFilter] = useState('en_attente')
  const [updating, setUpdating] = useState<string | null>(null)

  const load = () => {
    adminFetch('/api/avis?all=1')
      .then(r => r.ok ? r.json() : [])
      .then(data => setAvis(Array.isArray(data) ? data : []))
      .catch(() => setAvis([]))
  }

  useEffect(() => { load() }, [])

  const updateStatut = async (id: string, statut: string) => {
    setUpdating(id)
    await adminFetch(`/api/avis/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    })
    setAvis(prev => prev.map(a => a.id === id ? { ...a, statut: statut as any } : a))
    setUpdating(null)
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer définitivement cet avis ?')) return
    setUpdating(id)
    await adminFetch(`/api/avis/${id}`, { method: 'DELETE' })
    setAvis(prev => prev.filter(a => a.id !== id))
    setUpdating(null)
  }

  const filtered = avis.filter(a => filter === 'tous' || a.statut === filter)
  const nbEnAttente = avis.filter(a => a.statut === 'en_attente').length

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* HEADER STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total avis', value: avis.length, sub: 'toutes périodes' },
          { label: 'En attente', value: nbEnAttente, sub: 'à modérer', alert: nbEnAttente > 0 },
          { label: 'Approuvés', value: avis.filter(a => a.statut === 'approuve').length, sub: 'visibles publiquement' },
          { label: 'Rejetés', value: avis.filter(a => a.statut === 'rejete').length, sub: 'masqués' },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 border"
            style={{
              backgroundColor: stat.alert ? '#FFF7ED' : '#fff',
              borderColor: stat.alert ? '#FED7AA' : 'rgba(0,0,0,0.06)',
            }}
          >
            <p className="text-[11px] font-medium uppercase tracking-widest mb-1" style={{ color: '#6B7280' }}>
              {stat.label}
            </p>
            <p className="text-[24px] font-bold" style={{ color: stat.alert ? '#C2410C' : '#111827' }}>
              {stat.value}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['tous', ...STATUTS].map(s => {
          const count = s === 'tous' ? avis.length : avis.filter(a => a.statut === s).length
          const cfg = STATUT_CONFIG[s]
          const active = filter === s
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-4 py-2 rounded-full text-[12px] font-semibold border transition-all"
              style={{
                backgroundColor: active ? (s === 'tous' ? '#111827' : cfg.bg) : '#fff',
                color: active ? (s === 'tous' ? '#fff' : cfg.color) : '#6B7280',
                borderColor: active ? (s === 'tous' ? '#111827' : cfg.dot) : 'rgba(0,0,0,0.1)',
              }}
            >
              {s === 'tous' ? 'Tous' : cfg.label} ({count})
            </button>
          )
        })}
      </div>

      {/* LISTE */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl border" style={{ borderColor: 'rgba(0,0,0,0.06)', color: '#9CA3AF' }}>
            Aucun avis
          </div>
        )}
        {filtered.map(a => {
          const cfg = STATUT_CONFIG[a.statut]
          return (
            <div
              key={a.id}
              className="rounded-2xl p-5 border bg-white"
              style={{ borderColor: 'rgba(0,0,0,0.06)', borderLeftWidth: '3px', borderLeftColor: cfg.dot }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-bold" style={{ color: '#111827' }}>{a.nom}</span>
                    <Stars note={a.note} />
                  </div>
                  <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
                    {new Date(a.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                  {cfg.label}
                </span>
              </div>
              <p className="text-[13px] mb-4" style={{ color: '#374151' }}>{a.commentaire}</p>
              <div className="flex gap-2 flex-wrap">
                {a.statut !== 'approuve' && (
                  <button
                    onClick={() => updateStatut(a.id, 'approuve')}
                    disabled={updating === a.id}
                    className="px-4 py-2 rounded-full text-[12px] font-bold border transition-all"
                    style={{ backgroundColor: '#22C55E', color: '#fff', borderColor: '#22C55E', opacity: updating === a.id ? 0.6 : 1 }}
                  >
                    ✓ Approuver
                  </button>
                )}
                {a.statut !== 'rejete' && (
                  <button
                    onClick={() => updateStatut(a.id, 'rejete')}
                    disabled={updating === a.id}
                    className="px-4 py-2 rounded-full text-[12px] font-bold border transition-all"
                    style={{ backgroundColor: '#fff', color: '#B91C1C', borderColor: '#FCA5A5', opacity: updating === a.id ? 0.6 : 1 }}
                  >
                    ✕ Rejeter
                  </button>
                )}
                <button
                  onClick={() => remove(a.id)}
                  disabled={updating === a.id}
                  className="px-4 py-2 rounded-full text-[12px] font-bold border transition-all"
                  style={{ backgroundColor: '#fff', color: '#6B7280', borderColor: 'rgba(0,0,0,0.1)', opacity: updating === a.id ? 0.6 : 1 }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
