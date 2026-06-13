'use client'
import { useEffect, useState } from 'react'
import type { Commande } from '@/types'

const STATUTS = ['nouveau','en_cours','termine','annule']
const STATUT_COLORS: Record<string,string> = {
  nouveau:  'bg-blue-50 text-blue-700 border-blue-200',
  en_cours: 'bg-orange-50 text-orange-700 border-orange-200',
  termine:  'bg-green-50 text-green-700 border-green-200',
  annule:   'bg-red-50 text-red-700 border-red-200',
}

export default function CommandesAdmin() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [selected, setSelected] = useState<Commande|null>(null)
  const [filter, setFilter] = useState('tous')

  useEffect(() => {
    fetch('/api/commandes').then(r=>r.json()).then(setCommandes)
  }, [])

  const updateStatut = async (id: string, statut: string) => {
    await fetch(`/api/commandes/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({statut}) })
    setCommandes(prev => prev.map(c => c.id===id ? {...c, statut: statut as any} : c))
    if (selected?.id === id) setSelected(prev => prev ? {...prev, statut: statut as any} : null)
  }

  const filtered = filter === 'tous' ? commandes : commandes.filter(c => c.statut === filter)

  return (
    <div className="p-8">
      <h1 className="text-[24px] font-bold tracking-tight mb-2">Commandes</h1>
      <p className="text-[14px] text-brand-gray mb-6">{commandes.length} commande{commandes.length > 1 ? 's' : ''} au total</p>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['tous',...STATUTS].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all capitalize ${filter===s?'bg-brand-dark text-white border-brand-dark':'bg-white text-brand-dark border-black/15 hover:border-black/30'}`}>
            {s} {s!=='tous' && `(${commandes.filter(c=>c.statut===s).length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste */}
        <div className="flex flex-col gap-3">
          {filtered.map(c => (
            <div key={c.id} onClick={() => setSelected(c)} className={`bg-white rounded-[16px] p-5 border cursor-pointer hover:border-black/25 transition-all ${selected?.id===c.id?'border-brand-dark':'border-black/[0.08]'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[14px] font-bold font-mono">{c.reference}</div>
                  <div className="text-[13px] text-brand-dark font-medium">{c.nom_client}</div>
                  {c.entreprise && <div className="text-[12px] text-brand-gray">{c.entreprise}</div>}
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUT_COLORS[c.statut]}`}>{c.statut}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[13px] text-brand-gray">{c.produit} × {c.quantite} {c.urgent && '⚡'}</div>
                <div className="text-[14px] font-bold">{(c.prix_total||0).toLocaleString('fr-FR')} DA</div>
              </div>
              <div className="text-[11px] text-brand-gray mt-2">{new Date(c.created_at).toLocaleString('fr-FR')}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-brand-gray text-[14px]">Aucune commande</div>
          )}
        </div>

        {/* Détail */}
        {selected && (
          <div className="bg-white rounded-[20px] border border-black/[0.08] p-6 sticky top-8 h-fit">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-[18px] font-bold font-mono">{selected.reference}</div>
                <div className="text-[13px] text-brand-gray mt-0.5">{new Date(selected.created_at).toLocaleString('fr-FR')}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-brand-gray hover:text-brand-dark text-[20px]">✕</button>
            </div>

            {/* Changer statut */}
            <div className="mb-6">
              <label className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-2">Changer le statut</label>
              <div className="flex gap-2 flex-wrap">
                {STATUTS.map(s => (
                  <button key={s} onClick={() => updateStatut(selected.id, s)} className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all capitalize ${selected.statut===s?'bg-brand-dark text-white border-brand-dark':'bg-white text-brand-dark border-black/15 hover:border-black/30'}`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Détails */}
            <div className="flex flex-col gap-0 mb-6">
              {[
                ['Produit', selected.produit],
                ['Quantité', `${selected.quantite} pièces`],
                ['Couleur', selected.couleur],
                ['Tailles', selected.tailles?.join(', ') || '—'],
                ['Emplacement', selected.position],
                ['Technique', selected.technique],
                ['Urgent', selected.urgent ? 'Oui ⚡' : 'Non'],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2.5 border-b border-black/[0.05]">
                  <span className="text-[12px] text-brand-gray">{k}</span>
                  <span className="text-[12px] font-medium text-right">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-brand-light rounded-xl p-4 mb-4">
              <div className="text-[13px] font-bold mb-1">{selected.nom_client}</div>
              {selected.entreprise && <div className="text-[12px] text-brand-gray">{selected.entreprise}</div>}
              <a href={`tel:${selected.telephone}`} className="text-[13px] text-blue-600 no-underline block mt-1">{selected.telephone}</a>
              {selected.email && <div className="text-[12px] text-brand-gray">{selected.email}</div>}
            </div>

            {selected.notes && (
              <div className="bg-yellow-50 rounded-xl p-4 text-[13px] text-brand-dark mb-4"><strong>Notes :</strong> {selected.notes}</div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-black/[0.08]">
              <span className="text-[13px] text-brand-gray">Total commande</span>
              <span className="text-[20px] font-bold">{(selected.prix_total||0).toLocaleString('fr-FR')} DA</span>
            </div>

            <a href={`https://wa.me/${selected.telephone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-full text-[14px] font-medium hover:bg-green-600 transition-colors no-underline">
              💬 Contacter sur WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
