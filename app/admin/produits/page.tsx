'use client'

import { useState, useEffect } from "react"
import type { Produit } from '@/types'

const EMOJIS = ['👕','👔','🧥','🧢','🩲','👗','🧣','🧤']

export default function ProduitsAdmin() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [form, setForm] = useState({ nom:'', emoji:'👕', description:'', prix_base:0, actif:true })
  const [editing, setEditing] = useState<string|null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => fetch('/api/produits').then(r=>r.json()).then(setProduits)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.nom || !form.prix_base) return alert('Nom et prix requis')
    if (editing) {
      await fetch(`/api/produits/${editing}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    } else {
      await fetch('/api/produits', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    }
    setForm({ nom:'', emoji:'👕', description:'', prix_base:0, actif:true })
    setEditing(null); setShowForm(false); load()
  }

  const del = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    await fetch(`/api/produits/${id}`, { method:'DELETE' })
    load()
  }

  const toggleActif = async (id: string, actif: boolean) => {
    await fetch(`/api/produits/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({actif}) })
    load()
  }

  const startEdit = (p: Produit) => {
    setForm({ nom:p.nom, emoji:p.emoji, description:p.description||'', prix_base:p.prix_base, actif:p.actif })
    setEditing(p.id); setShowForm(true)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight mb-1">Produits</h1>
          <p className="text-[14px] text-brand-gray">{produits.length} produit{produits.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({nom:'',emoji:'👕',description:'',prix_base:0,actif:true}); setShowForm(true) }} className="bg-brand-dark text-white px-5 py-2.5 rounded-full text-[13px] font-medium hover:bg-neutral-800 transition-colors">
          + Ajouter un produit
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-[20px] border border-black/[0.08] p-6 mb-8">
          <h2 className="text-[16px] font-semibold mb-5">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium">Nom *</label>
              <input value={form.nom} onChange={e=>setForm(f=>({...f,nom:e.target.value}))} placeholder="ex: Polo MC" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium">Prix de base (DA) *</label>
              <input type="number" value={form.prix_base} onChange={e=>setForm(f=>({...f,prix_base:parseInt(e.target.value)||0}))} placeholder="ex: 1400" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium">Description</label>
              <input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="ex: Piqué coton premium" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium">Emoji</label>
              <div className="flex gap-2 flex-wrap">
                {EMOJIS.map(e => (
                  <button key={e} onClick={()=>setForm(f=>({...f,emoji:e}))} className={`w-10 h-10 rounded-xl text-[20px] border-2 transition-all ${form.emoji===e?'border-brand-dark bg-brand-light':'border-transparent bg-brand-light hover:border-black/20'}`}>{e}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={save} className="bg-brand-dark text-white px-6 py-2.5 rounded-full text-[13px] font-medium hover:bg-neutral-800 transition-colors">
              {editing ? 'Enregistrer' : 'Créer le produit'}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="px-6 py-2.5 rounded-full border border-black/20 text-[13px] font-medium">Annuler</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[20px] border border-black/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/[0.06]">
              {['Produit','Description','Prix','Actif','Actions'].map(h => (
                <th key={h} className="text-left text-[11px] font-bold tracking-widest uppercase text-brand-gray px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {produits.map(p => (
              <tr key={p.id} className="border-b border-black/[0.04] hover:bg-brand-light/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[24px]">{p.emoji}</span>
                    <span className="text-[14px] font-semibold">{p.nom}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-brand-gray">{p.description}</td>
                <td className="px-6 py-4 text-[14px] font-bold">{p.prix_base.toLocaleString('fr-FR')} DA</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleActif(p.id, !p.actif)} className={`w-10 h-5 rounded-full transition-all relative ${p.actif?'bg-green-500':'bg-black/20'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${p.actif?'left-5':'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(p)} className="text-[12px] text-blue-600 hover:underline font-medium">Modifier</button>
                    <button onClick={() => del(p.id)} className="text-[12px] text-red-500 hover:underline font-medium">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {produits.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-brand-gray text-[14px]">Aucun produit</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
