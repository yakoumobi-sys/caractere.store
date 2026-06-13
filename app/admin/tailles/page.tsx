'use client'
import { useEffect, useState } from 'react'
import type { Taille } from '@/types'

export default function TaillesAdmin() {
  const [tailles, setTailles] = useState<Taille[]>([])
  const [nom, setNom] = useState('')

  const load = () => fetch('/api/tailles').then(r=>r.json()).then(setTailles)
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!nom.trim()) return
    await fetch('/api/tailles', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({nom:nom.trim().toUpperCase(), actif:true}) })
    setNom(''); load()
  }

  const del = async (id: string) => {
    if (!confirm('Supprimer cette taille ?')) return
    await fetch(`/api/tailles/${id}`, { method:'DELETE' }); load()
  }

  const toggle = async (id: string, actif: boolean) => {
    await fetch(`/api/tailles/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({actif}) })
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight mb-1">Tailles</h1>
          <p className="text-[14px] text-brand-gray">{tailles.length} taille{tailles.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-[20px] border border-black/[0.08] p-6 mb-8">
        <h2 className="text-[15px] font-semibold mb-4">Ajouter une taille</h2>
        <div className="flex gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium">Nom de la taille</label>
            <input value={nom} onChange={e=>setNom(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="ex: 3XL ou 44 ou Unique" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none w-48" />
          </div>
          <button onClick={add} className="bg-brand-dark text-white px-6 py-2.5 rounded-full text-[13px] font-medium hover:bg-neutral-800 transition-colors">Ajouter</button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex flex-wrap gap-3">
        {tailles.map(t => (
          <div key={t.id} className={`bg-white rounded-[14px] border-2 px-5 py-4 flex flex-col items-center gap-2 min-w-[80px] ${t.actif?'border-black/10':'border-black/[0.04] opacity-50'}`}>
            <span className="text-[18px] font-bold">{t.nom}</span>
            <div className="flex gap-2">
              <button onClick={() => toggle(t.id, !t.actif)} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.actif?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
                {t.actif?'Actif':'Off'}
              </button>
              <button onClick={() => del(t.id)} className="text-[10px] text-red-500 hover:underline font-medium">✕</button>
            </div>
          </div>
        ))}
        {tailles.length === 0 && (
          <div className="text-center py-16 w-full text-brand-gray text-[14px]">Aucune taille</div>
        )}
      </div>
    </div>
  )
}
