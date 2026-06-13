'use client'
import { useEffect, useState } from 'react'
import type { Couleur } from '@/types'

export default function CouleursAdmin() {
  const [couleurs, setCouleurs] = useState<Couleur[]>([])
  const [form, setForm] = useState({ nom:'', hex:'#1d1d1f', actif:true })
  const [editing, setEditing] = useState<string|null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => fetch('/api/couleurs').then(r=>r.json()).then(setCouleurs)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.nom || !form.hex) return alert('Nom et couleur requis')
    if (editing) {
      await fetch(`/api/couleurs/${editing}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    } else {
      await fetch('/api/couleurs', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    }
    setForm({ nom:'', hex:'#1d1d1f', actif:true }); setEditing(null); setShowForm(false); load()
  }

  const del = async (id: string) => {
    if (!confirm('Supprimer cette couleur ?')) return
    await fetch(`/api/couleurs/${id}`, { method:'DELETE' }); load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight mb-1">Couleurs</h1>
          <p className="text-[14px] text-brand-gray">{couleurs.length} couleur{couleurs.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({nom:'',hex:'#1d1d1f',actif:true}); setShowForm(true) }} className="bg-brand-dark text-white px-5 py-2.5 rounded-full text-[13px] font-medium hover:bg-neutral-800 transition-colors">
          + Ajouter une couleur
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-[20px] border border-black/[0.08] p-6 mb-8">
          <h2 className="text-[16px] font-semibold mb-5">{editing ? 'Modifier' : 'Nouvelle couleur'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium">Nom *</label>
              <input value={form.nom} onChange={e=>setForm(f=>({...f,nom:e.target.value}))} placeholder="ex: Bordeaux" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium">Couleur *</label>
              <div className="flex gap-3 items-center">
                <input type="color" value={form.hex} onChange={e=>setForm(f=>({...f,hex:e.target.value}))} className="w-12 h-10 rounded-lg border border-black/[0.12] cursor-pointer" />
                <input value={form.hex} onChange={e=>setForm(f=>({...f,hex:e.target.value}))} placeholder="#ffffff" className="flex-1 border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] font-mono focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={save} className="bg-brand-dark text-white px-6 py-2.5 rounded-full text-[13px] font-medium hover:bg-neutral-800 transition-colors flex-1">
                {editing ? 'Enregistrer' : 'Créer'}
              </button>
              <button onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2.5 rounded-full border border-black/20 text-[13px]">✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Grid visuelle */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {couleurs.map(c => (
          <div key={c.id} className="bg-white rounded-[16px] border border-black/[0.08] overflow-hidden">
            <div className="h-20 w-full" style={{background:c.hex, boxShadow: c.hex==='#FFFFFF' ? 'inset 0 0 0 1px rgba(0,0,0,0.08)' : 'none'}} />
            <div className="p-3">
              <div className="text-[13px] font-semibold">{c.nom}</div>
              <div className="text-[11px] text-brand-gray font-mono">{c.hex}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => { setForm({nom:c.nom,hex:c.hex,actif:c.actif}); setEditing(c.id); setShowForm(true) }} className="text-[11px] text-blue-600 hover:underline">Modifier</button>
                <button onClick={() => del(c.id)} className="text-[11px] text-red-500 hover:underline">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
        {couleurs.length === 0 && (
          <div className="col-span-5 text-center py-16 text-brand-gray text-[14px]">Aucune couleur</div>
        )}
      </div>
    </div>
  )
}
