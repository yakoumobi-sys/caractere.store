'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Produit, Couleur, Taille } from '@/types'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

interface OrderState {
  step: number
  produit: Produit | null
  quantite: number
  couleur: string
  couleurHex: string
  tailles: string[]
  logoFile: File | null
  logoUrl: string | null
  position: string
  technique: string
  urgent: boolean
  nom: string
  entreprise: string
  telephone: string
  email: string
  notes: string
}

const DEFAULT: OrderState = {
  step: 1, produit: null, quantite: 10,
  couleur: 'Blanc', couleurHex: '#FFFFFF', tailles: ['M','L','XL'],
  logoFile: null, logoUrl: null,
  position: 'Logo petit — côté cœur', technique: '🧵 Broderie',
  urgent: false, nom: '', entreprise: '', telephone: '', email: '', notes: ''
}

const POSITIONS = [
  {id:'coeur',name:'Logo petit — côté cœur',desc:'Broderie discrète avant gauche',badge:'Standard'},
  {id:'coeur-dos',name:'Petit cœur + grand dos',desc:'Discret devant, impact dans le dos',badge:'+25%'},
  {id:'poitrine',name:'Logo grand — poitrine',desc:'Impression pleine poitrine centrée',badge:'Standard'},
  {id:'poitrine-dos',name:'Grand poitrine + grand dos',desc:'Impact maximum avant et arrière',badge:'+30%'},
]
const TECHNIQUES = ['🧵 Broderie','🖨 DTF','🎨 Sérigraphie','💬 Conseil équipe']

export default function ConfigurateurPage() {
  const [order, setOrder] = useState<OrderState>(DEFAULT)
  const [produits, setProduits] = useState<Produit[]>([])
  const [couleurs, setCouleurs] = useState<Couleur[]>([])
  const [tailles, setTailles] = useState<Taille[]>([])
  const [refCode, setRefCode] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fallbackProduits = [
      {id:'1',nom:'T-shirt',emoji:'👕',description:'100% coton, broderie ou DTF',prix_base:850,actif:true,ordre:1},
      {id:'2',nom:'Polo',emoji:'👔',description:'Pique coton premium',prix_base:1400,actif:true,ordre:2},
      {id:'3',nom:'Gilet de travail',emoji:'🦺',description:'Gilet multipoches personnalise',prix_base:1800,actif:true,ordre:3},
      {id:'4',nom:'Gilet de securite',emoji:'🦺',description:'Haute visibilite',prix_base:1600,actif:true,ordre:4},
      {id:'5',nom:'Casquette',emoji:'🧢',description:'Broderie structuree',prix_base:900,actif:true,ordre:5},
      {id:'6',nom:'Totebag',emoji:'👜',description:'Coton canvas DTF',prix_base:650,actif:true,ordre:6},
      {id:'7',nom:'Tablier',emoji:'👨‍🍳',description:'Cuisine ou commerce',prix_base:1200,actif:true,ordre:7},
    ]
    const fallbackCouleurs = [
      {id:'1',nom:'Blanc',hex:'#FFFFFF',actif:true,ordre:1},
      {id:'2',nom:'Noir',hex:'#1d1d1f',actif:true,ordre:2},
      {id:'3',nom:'Marine',hex:'#1B2A4A',actif:true,ordre:3},
      {id:'4',nom:'Gris',hex:'#9E9E9E',actif:true,ordre:4},
      {id:'5',nom:'Bordeaux',hex:'#6D1A2A',actif:true,ordre:5},
      {id:'6',nom:'Vert bouteille',hex:'#1B4D3E',actif:true,ordre:6},
      {id:'7',nom:'Beige',hex:'#D4B896',actif:true,ordre:7},
    ]
    const fallbackTailles = [
      {id:'1',nom:'XS',actif:true,ordre:1},
      {id:'2',nom:'S',actif:true,ordre:2},
      {id:'3',nom:'M',actif:true,ordre:3},
      {id:'4',nom:'L',actif:true,ordre:4},
      {id:'5',nom:'XL',actif:true,ordre:5},
      {id:'6',nom:'XXL',actif:true,ordre:6},
      {id:'7',nom:'XXXL',actif:true,ordre:7},
    ]
    Promise.all([
      supabase.from('produits').select('*').eq('actif',true).order('ordre'),
      supabase.from('couleurs').select('*').eq('actif',true).order('ordre'),
      supabase.from('tailles').select('*').eq('actif',true).order('ordre'),
    ]).then(([p,c,t]) => {
      setProduits(p.data && p.data.length > 0 ? p.data : fallbackProduits)
      setCouleurs(c.data && c.data.length > 0 ? c.data : fallbackCouleurs)
      setTailles(t.data && t.data.length > 0 ? t.data : fallbackTailles)
    }).catch(() => {
      setProduits(fallbackProduits)
      setCouleurs(fallbackCouleurs)
      setTailles(fallbackTailles)
    })
  }, [])

  const up = (patch: Partial<OrderState>) => setOrder(prev => ({...prev,...patch}))

  const calcPrice = () => {
    if (!order.produit) return {unit:0,total:0,remise:0}
    const r = order.quantite >= 100 ? 0.10 : order.quantite >= 50 ? 0.05 : 0
    const unit = Math.round(order.produit.prix_base * (1-r))
    return {unit, total: unit * order.quantite, remise: r}
  }

  const next = () => { up({step: order.step+1}); window.scrollTo({top:0,behavior:'smooth'}) }
  const prev = () => { up({step: order.step-1}); window.scrollTo({top:0,behavior:'smooth'}) }

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const r = new FileReader()
      r.onload = e => up({logoFile:file, logoUrl: e.target?.result as string})
      r.readAsDataURL(file)
    } else {
      up({logoFile:file, logoUrl:null})
    }
  }

  const handleSubmit = async () => {
    if (!order.nom || !order.telephone) return alert('Nom et téléphone requis.')
    setLoading(true)
    const ref = 'CAR-' + Date.now().toString(36).toUpperCase()
    const {unit, total} = calcPrice()
    await fetch('/api/commandes', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        reference: ref,
        produit: order.produit?.nom,
        quantite: order.quantite,
        couleur: order.couleur,
        tailles: order.tailles,
        position: order.position,
        technique: order.technique,
        urgent: order.urgent,
        nom_client: order.nom,
        entreprise: order.entreprise,
        telephone: order.telephone,
        email: order.email,
        notes: order.notes,
        prix_unitaire: unit,
        prix_total: total,
      })
    })
    setRefCode(ref)
    setLoading(false)
    up({step:6})
    window.scrollTo({top:0,behavior:'smooth'})
  }

  const {unit, total, remise} = calcPrice()
  const stepLabels = ['Produit','Couleurs','Logo','Position','Contact']

  return (
    <>
      <Navbar />
      {order.step < 6 && (
        <div className="sticky top-14 z-40 bg-white/90 backdrop-blur-md border-b border-black/[0.08] py-4 px-6">
          <div className="max-w-[900px] mx-auto flex items-center justify-center gap-0">
            {stepLabels.map((label,i) => {
              const s = i+1; const done = s < order.step; const active = s === order.step
              return (
                <div key={s} className="flex items-center">
                  {i > 0 && <div className={`w-12 h-px mx-1 ${done||active?'bg-brand-dark':'bg-black/10'}`} />}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${done?'bg-brand-dark text-white':active?'bg-brand-dark text-white ring-4 ring-brand-dark/20':'bg-transparent text-brand-gray border border-black/20'}`}>
                      {done?'✓':s}
                    </div>
                    <span className={`text-[11px] font-medium hidden sm:block ${active?'text-brand-dark':'text-brand-gray'}`}>{label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <main className="pt-14 min-h-screen bg-white">
        {order.step === 6 ? (
          <div className="text-center py-20 max-w-[500px] mx-auto px-6">
            <div className="text-[64px] mb-6">✅</div>
            <h2 className="text-[28px] font-bold tracking-tight mb-3">Demande envoyée !</h2>
            <p className="text-[16px] text-brand-gray mb-2">Votre référence commande</p>
            <div className="text-[22px] font-bold font-mono bg-brand-light rounded-2xl px-6 py-3 inline-block mb-6 tracking-widest">{refCode}</div>
            <p className="text-[14px] text-brand-gray leading-relaxed mb-10">Notre équipe vous contacte sous 24h par WhatsApp.</p>
            <button onClick={() => { setOrder(DEFAULT); setRefCode('') }} className="bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors">Nouvelle commande</button>
          </div>
        ) : (
          <div className="max-w-[900px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* WIZARD */}
            <div className="lg:col-span-2">

              {/* STEP 1 */}
              {order.step === 1 && (
                <div>
                  <div className="text-[22px] font-bold tracking-tight mb-1">Choisissez votre produit</div>
                  <div className="text-[14px] text-brand-gray mb-8">Sélectionnez le type de textile à personnaliser</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                    {produits.map(p => {
                      const BASE = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image'
                      const imgs: Record<string,string> = {
                        'T-shirt': BASE + '/IMG_5509.png',
                        'Polo': BASE + '/IMG_5510.png',
                        'Casquette': BASE + '/IMG_5511.png',
                        'Totebag': BASE + '/IMG_5512.png',
                        'Gilet de travail': BASE + '/IMG_5599.png',
                        'Gilet de securite': BASE + '/IMG_5599.png',
                        'Tablier': BASE + '/IMG_5510.png',
                      }
                      const imgUrl = imgs[p.nom] || BASE + '/IMG_5509.png'
                      return (
                        <button key={p.id} onClick={() => up({produit:p})} className={`text-left rounded-2xl border-2 transition-all cursor-pointer bg-white overflow-hidden ${order.produit?.id===p.id?'border-brand-dark':'border-black/10 hover:border-black/25'}`}>
                          <div className="w-full aspect-square overflow-hidden bg-brand-light">
                            <img src={imgUrl} alt={p.nom} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4">
                            <div className="text-[15px] font-semibold tracking-tight">{p.nom}</div>
                            <div className="text-[12px] text-brand-gray mt-0.5">{p.description}</div>
                            <div className="text-[14px] font-bold mt-2">des {p.prix_base.toLocaleString('fr-FR')} DA</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <div className="mb-8">
                    <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray block mb-3">Quantité</label>
                    <div className="flex items-center gap-4">
                      <button onClick={() => up({quantite:Math.max(1,order.quantite-1)})} className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-[18px] bg-white">−</button>
                      <input type="number" value={order.quantite} min={1} onChange={e => up({quantite:Math.max(1,parseInt(e.target.value)||1)})} className="w-20 text-center text-[18px] font-bold border border-black/20 rounded-xl py-2 focus:outline-none" />
                      <button onClick={() => up({quantite:order.quantite+1})} className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-[18px] bg-white">+</button>
                    </div>
                    {order.quantite >= 50 && <div className="mt-3 text-[13px] font-medium text-green-700 bg-green-50 px-4 py-2 rounded-xl inline-block">🎉 {order.quantite>=100?'−10%':'−5%'} appliqué</div>}
                  </div>
                  <button onClick={next} disabled={!order.produit} className="bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Continuer →</button>
                </div>
              )}

              {/* STEP 2 */}
              {order.step === 2 && (
                <div>
                  <div className="text-[22px] font-bold tracking-tight mb-1">Couleur & Tailles</div>
                  <div className="text-[14px] text-brand-gray mb-8">Choisissez la couleur et les tailles souhaitées</div>
                  <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray block mb-4">Couleur du textile</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {couleurs.map(c => (
                      <button key={c.id} onClick={() => up({couleur:c.nom, couleurHex:c.hex})} title={c.nom} className={`w-9 h-9 rounded-full border-2 transition-all ${order.couleur===c.nom?'border-brand-dark scale-110':'border-transparent hover:border-black/20'}`} style={{background:c.hex, boxShadow:c.hex==='#FFFFFF'?'inset 0 0 0 1px rgba(0,0,0,0.12)':'none'}} />
                    ))}
                  </div>
                  <div className="text-[13px] text-brand-gray mb-8">Couleur : <strong className="text-brand-dark">{order.couleur}</strong></div>
                  <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray block mb-4">Tailles (multi-sélection)</label>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {tailles.map(t => (
                      <button key={t.id} onClick={() => { const s=order.tailles.includes(t.nom)?order.tailles.filter(x=>x!==t.nom):[...order.tailles,t.nom]; up({tailles:s}) }} className={`px-4 py-2 rounded-xl text-[13px] font-medium border transition-all ${order.tailles.includes(t.nom)?'bg-brand-dark text-white border-brand-dark':'bg-white text-brand-dark border-black/15 hover:border-black/30'}`}>{t.nom}</button>
                    ))}
                  </div>
                  <div className="flex gap-3"><button onClick={prev} className="px-6 py-3 rounded-full border border-black/20 text-[14px] font-medium">← Retour</button><button onClick={next} className="bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors">Continuer →</button></div>
                </div>
              )}

              {/* STEP 3 */}
              {order.step === 3 && (
                <div>
                  <div className="text-[22px] font-bold tracking-tight mb-1">Votre logo</div>
                  <div className="text-[14px] text-brand-gray mb-8">Uploadez votre logo pour la personnalisation</div>
                  <div className="border-2 border-dashed border-black/20 rounded-2xl p-12 text-center mb-6 cursor-pointer hover:border-black/40 transition-colors bg-brand-light/50" onClick={() => fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f)}}>
                    <div className="text-[40px] mb-3">📁</div>
                    <div className="text-[15px] font-medium mb-1">Glissez votre logo ici</div>
                    <div className="text-[13px] text-brand-gray">ou cliquez pour parcourir</div>
                    <div className="text-[11px] text-brand-gray/70 mt-2">AI · EPS · SVG · PDF · PNG · JPG</div>
                    <input ref={fileRef} type="file" className="hidden" accept=".ai,.eps,.svg,.pdf,.png,.jpg,.jpeg" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f)}} />
                  </div>
                  {order.logoFile && (
                    <div className="bg-white border border-black/10 rounded-2xl p-4 flex items-center gap-4 mb-4">
                      {order.logoUrl && <img src={order.logoUrl} alt="Logo" className="w-16 h-16 object-contain rounded-xl bg-brand-light" />}
                      <div className="flex-1"><div className="text-[14px] font-semibold">{order.logoFile.name}</div><div className="text-[12px] text-brand-gray">{(order.logoFile.size/1024).toFixed(0)} Ko</div></div>
                      <button onClick={() => up({logoFile:null,logoUrl:null})} className="text-[12px] text-red-500 font-medium">Supprimer</button>
                    </div>
                  )}
                  <p className="text-[13px] text-brand-gray mb-8">💡 Pas de logo ? Notre équipe vectorise gratuitement.</p>
                  <div className="flex gap-3"><button onClick={prev} className="px-6 py-3 rounded-full border border-black/20 text-[14px] font-medium">← Retour</button><button onClick={next} className="bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors">Continuer →</button></div>
                </div>
              )}

              {/* STEP 4 */}
              {order.step === 4 && (
                <div>
                  <div className="text-[22px] font-bold tracking-tight mb-1">Emplacement & Technique</div>
                  <div className="text-[14px] text-brand-gray mb-8">Où et comment apposer votre logo</div>
                  <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray block mb-4">Emplacement du logo</label>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {POSITIONS.map(p => (
                      <button key={p.id} onClick={() => up({position:p.name})} className={`text-left p-4 rounded-2xl border-2 transition-all bg-white ${order.position===p.name?'border-brand-dark':'border-black/10 hover:border-black/25'}`}>
                        <div className="w-full aspect-square bg-brand-light rounded-xl flex items-center justify-center text-[32px] mb-3">👕</div>
                        <div className="text-[13px] font-semibold tracking-tight">{p.name}</div>
                        <div className="text-[11px] text-brand-gray mt-0.5">{p.desc}</div>
                        <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.badge==='Standard'?'bg-brand-light text-brand-gray':'bg-brand-dark text-white'}`}>{p.badge}</span>
                      </button>
                    ))}
                  </div>
                  <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray block mb-4">Technique</label>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {TECHNIQUES.map(t => (
                      <button key={t} onClick={() => up({technique:t})} className={`px-5 py-2.5 rounded-full text-[13px] font-medium border transition-all ${order.technique===t?'bg-brand-dark text-white border-brand-dark':'bg-white text-brand-dark border-black/15 hover:border-black/30'}`}>{t}</button>
                    ))}
                  </div>
                  <div className="flex gap-3"><button onClick={prev} className="px-6 py-3 rounded-full border border-black/20 text-[14px] font-medium">← Retour</button><button onClick={next} className="bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors">Continuer →</button></div>
                </div>
              )}

              {/* STEP 5 */}
              {order.step === 5 && (
                <div>
                  <div className="text-[22px] font-bold tracking-tight mb-1">Vos coordonnées</div>
                  <div className="text-[14px] text-brand-gray mb-8">Dernière étape — on vous contacte sous 24h</div>
                  <div className="flex flex-col gap-4 max-w-[480px]">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Nom complet *</label><input type="text" value={order.nom} onChange={e=>up({nom:e.target.value})} placeholder="Votre nom" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none" /></div>
                      <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Entreprise</label><input type="text" value={order.entreprise} onChange={e=>up({entreprise:e.target.value})} placeholder="Nom entreprise" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Téléphone *</label><input type="tel" value={order.telephone} onChange={e=>up({telephone:e.target.value})} placeholder="+213 6XX XXX XXX" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none" /></div>
                      <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Email</label><input type="email" value={order.email} onChange={e=>up({email:e.target.value})} placeholder="votre@email.com" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none" /></div>
                    </div>
                    <div className="flex items-center justify-between bg-brand-light rounded-2xl px-4 py-3">
                      <div><div className="text-[14px] font-medium">Commande urgente</div><div className="text-[12px] text-brand-gray">Livraison express</div></div>
                      <button onClick={() => up({urgent:!order.urgent})} className={`w-12 h-6 rounded-full transition-all relative ${order.urgent?'bg-brand-dark':'bg-black/20'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow ${order.urgent?'left-6':'left-0.5'}`} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Notes</label><textarea value={order.notes} onChange={e=>up({notes:e.target.value})} rows={3} placeholder="Informations utiles..." className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none resize-none" /></div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={prev} className="px-6 py-3 rounded-full border border-black/20 text-[14px] font-medium">← Retour</button>
                    <button onClick={handleSubmit} disabled={loading} className="bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60">
                      {loading ? 'Envoi...' : 'Envoyer ma demande →'}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* SUMMARY SIDEBAR */}
            <div className="hidden lg:block">
              <div className="bg-brand-light rounded-[20px] p-6 sticky top-32">
                <div className="text-[13px] font-bold tracking-widest uppercase text-brand-gray mb-5">Résumé</div>
                <div className="flex flex-col gap-0">
                  {[
                    {l:'Produit',   v:order.produit?.nom ?? '—', e:!order.produit},
                    {l:'Quantité',  v:`${order.quantite} pièces`},
                    {l:'Couleur',   v:order.couleur},
                    {l:'Tailles',   v:order.tailles.length ? order.tailles.join(', ') : '—'},
                    {l:'Logo',      v:order.logoFile ? order.logoFile.name : 'Non uploadé', e:!order.logoFile},
                    {l:'Emplacement',v:order.position},
                    {l:'Technique', v:order.technique},
                  ].map(r => (
                    <div key={r.l} className="flex justify-between py-2.5 border-b border-black/[0.06] last:border-b-0">
                      <span className="text-[12px] text-brand-gray">{r.l}</span>
                      <span className={`text-[12px] font-medium text-right max-w-[140px] ${r.e?'text-brand-gray':'text-brand-dark'}`}>{r.v}</span>
                    </div>
                  ))}
                </div>
                {order.produit && (
                  <div className="mt-5 pt-5 border-t border-black/[0.08]">
                    {remise > 0 && <div className="text-[11px] text-green-700 font-medium mb-2">✓ Remise {Math.round(remise*100)}% appliquée</div>}
                    <div className="flex justify-between items-baseline mb-1"><span className="text-[12px] text-brand-gray">Prix unitaire</span><span className="text-[14px] font-semibold">{unit.toLocaleString('fr-FR')} DA</span></div>
                    <div className="flex justify-between items-baseline"><span className="text-[12px] text-brand-gray">Total estimé</span><span className="text-[20px] font-bold tracking-tight">{total.toLocaleString('fr-FR')} DA</span></div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </main>
    </>
  )
}
