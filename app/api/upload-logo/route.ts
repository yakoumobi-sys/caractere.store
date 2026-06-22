'use client'
import { useEffect, useState } from 'react'
import type { Commande } from '@/types'

const STATUTS = ['nouveau', 'en_cours', 'termine', 'annule']

const STATUT_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  nouveau:  { label: 'Nouveau',      color: '#1D4ED8', bg: '#EFF6FF', dot: '#3B82F6' },
  en_cours: { label: 'En cours',     color: '#C2410C', bg: '#FFF7ED', dot: '#F97316' },
  termine:  { label: 'Termine',      color: '#15803D', bg: '#F0FDF4', dot: '#22C55E' },
  annule:   { label: 'Annule',       color: '#B91C1C', bg: '#FEF2F2', dot: '#EF4444' },
}

export default function CommandesAdmin() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [selected, setSelected] = useState<Commande | null>(null)
  const [filter, setFilter] = useState('tous')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetch('/api/commandes')
      .then(r => r.ok ? r.json() : [])
      .then(data => setCommandes(Array.isArray(data) ? data : []))
      .catch(() => setCommandes([]))
  }, [])

  const updateStatut = async (id: string, statut: string) => {
    setUpdating(true)
    await fetch(`/api/commandes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    })
    setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut: statut as any } : c))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, statut: statut as any } : null)
    setUpdating(false)
  }

  const filtered = commandes
    .filter(c => filter === 'tous' || c.statut === filter)
    .filter(c =>
      search === '' ||
      c.reference.toLowerCase().includes(search.toLowerCase()) ||
      c.nom_client?.toLowerCase().includes(search.toLowerCase()) ||
      c.telephone?.includes(search) ||
      c.entreprise?.toLowerCase().includes(search.toLowerCase())
    )

  const totalCA = commandes.reduce((sum, c) => sum + (c.prix_total || 0), 0)
  const nbNouveau = commandes.filter(c => c.statut === 'nouveau').length
  const nbEnCours = commandes.filter(c => c.statut === 'en_cours').length

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* HEADER STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total commandes', value: commandes.length, sub: 'toutes periodes' },
          { label: 'Nouvelles', value: nbNouveau, sub: 'en attente', alert: nbNouveau > 0 },
          { label: 'En production', value: nbEnCours, sub: 'en cours' },
          { label: 'Chiffre d\'affaires', value: totalCA.toLocaleString('fr-FR') + ' DA', sub: 'cumule' },
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

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col gap-3 mb-6">
        <input
          placeholder="Rechercher par reference, nom, telephone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-[14px] outline-none"
          style={{ borderColor: 'rgba(0,0,0,0.12)', backgroundColor: '#fff' }}
        />
        <div className="flex gap-2 flex-wrap">
          {['tous', ...STATUTS].map(s => {
            const count = s === 'tous' ? commandes.length : commandes.filter(c => c.statut === s).length
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LISTE */}
        <div className="lg:col-span-2 flex flex-col gap-2">
          {filtered.length === 0 && (
            <div className="text-center py-16 rounded-2xl border" style={{ borderColor: 'rgba(0,0,0,0.06)', color: '#9CA3AF' }}>
              Aucune commande
            </div>
          )}
          {filtered.map(c => {
            const cfg = STATUT_CONFIG[c.statut]
            const isSelected = selected?.id === c.id
            return (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                className="rounded-xl p-4 border cursor-pointer transition-all"
                style={{
                  backgroundColor: isSelected ? '#F9FAFB' : '#fff',
                  borderColor: isSelected ? '#111827' : 'rgba(0,0,0,0.06)',
                  borderLeftWidth: isSelected ? '3px' : '1px',
                  borderLeftColor: isSelected ? '#111827' : cfg.dot,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-bold font-mono" style={{ color: '#111827' }}>
                    {c.reference}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: '#111827' }}>{c.nom_client}</p>
                    {c.entreprise && <p className="text-[11px]" style={{ color: '#9CA3AF' }}>{c.entreprise}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold" style={{ color: '#111827' }}>
                      {(c.prix_total || 0).toLocaleString('fr-FR')} DA
                    </p>
                    <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
                      {c.produit} x{c.quantite} {c.urgent ? '⚡' : ''}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] mt-2" style={{ color: '#D1D5DB' }}>
                  {new Date(c.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
            )
          })}
        </div>

        {/* DETAIL */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div
              className="rounded-2xl border h-64 flex items-center justify-center"
              style={{ borderColor: 'rgba(0,0,0,0.06)', color: '#D1D5DB', borderStyle: 'dashed' }}
            >
              <p className="text-[14px]">Selectionnez une commande</p>
            </div>
          ) : (
            <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>

              {/* Detail header */}
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <div>
                  <p className="text-[16px] font-bold font-mono">{selected.reference}</p>
                  <p className="text-[12px]" style={{ color: '#9CA3AF' }}>
                    {new Date(selected.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#6B7280' }}
                >
                  x
                </button>
              </div>

              {/* Logo client */}
              {selected.logo_url && (
                <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)', backgroundColor: '#F9FAFB' }}>
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
                    Logo client
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={selected.logo_url}
                      alt="Logo client"
                      className="h-20 w-20 object-contain rounded-xl bg-white border"
                      style={{ borderColor: 'rgba(0,0,0,0.08)', padding: '8px' }}
                    />
                    <a
                      href={selected.logo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] font-medium no-underline px-4 py-2 rounded-full border"
                      style={{ color: '#1D4ED8', borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' }}
                    >
                      Telecharger le logo
                    </a>
                  </div>
                </div>
              )}

              {!selected.logo_url && (
                <div className="px-6 py-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)', backgroundColor: '#FEF9C3' }}>
                  <p className="text-[12px]" style={{ color: '#854D0E' }}>
                    Pas de logo uploade pour cette commande
                  </p>
                </div>
              )}

              {/* Changer statut */}
              <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
                  Statut de la commande
                </p>
                <div className="flex gap-2 flex-wrap">
                  {STATUTS.map(s => {
                    const cfg = STATUT_CONFIG[s]
                    const active = selected.statut === s
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatut(selected.id, s)}
                        disabled={updating}
                        className="px-4 py-2 rounded-full text-[12px] font-bold border transition-all"
                        style={{
                          backgroundColor: active ? cfg.dot : '#fff',
                          color: active ? '#fff' : cfg.color,
                          borderColor: active ? cfg.dot : cfg.dot + '60',
                          opacity: updating ? 0.6 : 1,
                        }}
                      >
                        {active ? '✓ ' : ''}{cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Infos commande */}
              <div className="px-6 py-4 grid grid-cols-2 gap-x-6 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                {[
                  ['Produit', selected.produit],
                  ['Quantite', `${selected.quantite} pieces`],
                  ['Couleur', selected.couleur],
                  ['Tailles', selected.tailles?.join(', ') || '-'],
                  ['Emplacement', selected.position],
                  ['Technique', selected.technique],
                  ['Urgent', selected.urgent ? 'Oui ⚡' : 'Non'],
                ].map(([k, v]) => (
                  <div key={k} className="py-2 border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>{k}</p>
                    <p className="text-[13px] font-medium mt-0.5" style={{ color: '#111827' }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Client */}
              <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Client</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-bold" style={{ color: '#111827' }}>{selected.nom_client}</p>
                    {selected.entreprise && <p className="text-[12px]" style={{ color: '#6B7280' }}>{selected.entreprise}</p>}
                    {selected.email && <p className="text-[12px]" style={{ color: '#6B7280' }}>{selected.email}</p>}
                  </div>
                  <a
                    href={`tel:${selected.telephone}`}
                    className="text-[14px] font-bold no-underline px-4 py-2 rounded-full"
                    style={{ color: '#1D4ED8', backgroundColor: '#EFF6FF' }}
                  >
                    {selected.telephone}
                  </a>
                </div>
              </div>

              {/* Notes */}
              {selected.notes && (
                <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)', backgroundColor: '#FEFCE8' }}>
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: '#A16207' }}>Notes</p>
                  <p className="text-[13px]" style={{ color: '#854D0E' }}>{selected.notes}</p>
                </div>
              )}

              {/* Total + Actions */}
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Total commande</p>
                  <p className="text-[22px] font-bold" style={{ color: '#111827' }}>
                    {(selected.prix_total || 0).toLocaleString('fr-FR')} DA
                  </p>
                </div>
                <a
                  href={`https://wa.me/${selected.telephone?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 no-underline rounded-full px-5 py-3 text-[13px] font-semibold text-white"
                  style={{ backgroundColor: '#25D366' }}
                >
                  WhatsApp
                </a>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
