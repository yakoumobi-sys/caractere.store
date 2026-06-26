'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Produit, Couleur, Taille } from '@/types'
import Navbar from '@/components/layout/Navbar'

interface OrderState {
  step: number
  produit: Produit | null
  quantite: number
  couleur: string
  couleurHex: string
  tailles: string[]
  logoFile: File | null
  logoUrl: string | null
  logoUploadUrl: string | null
  position: string
  technique: string
  urgent: boolean
  nom: string
  entreprise: string
  telephone: string
  email: string
  notes: string
  whatsappMsg: string
}

const DEFAULT: OrderState = {
  step: 1, produit: null, quantite: 1,
  couleur: 'Blanc', couleurHex: '#FFFFFF', tailles: ['M'],
  logoFile: null, logoUrl: null, logoUploadUrl: null,
  position: 'Logo petit — côté coeur', technique: 'DTF',
  urgent: false, nom: '', entreprise: '', telephone: '', email: '', notes: '',
  whatsappMsg: ''
}

const TECHNIQUES = ['Broderie','DTF','Conseil equipe']

export default function ConfigurateurPage() {
  const [order, setOrder] = useState<OrderState>(DEFAULT)
  const [produits, setProduits] = useState<Produit[]>([])
  const [couleurs, setCouleurs] = useState<Couleur[]>([])
  const [tailles, setTailles] = useState<Taille[]>([])
  const [refCode, setRefCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [fromDesigner, setFromDesigner] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fallbackProduits = [
      {id:'1',nom:'T-shirt',emoji:'',description:'100% coton, broderie ou DTF',prix_base:1950,actif:true,ordre:1},
      {id:'2',nom:'Polo',emoji:'',description:'Pique coton premium',prix_base:2300,actif:true,ordre:2},
      {id:'3',nom:'Gilet de travail',emoji:'',description:'Gilet multipoches personnalise',prix_base:2500,actif:true,ordre:3},
      {id:'4',nom:'Gilet de securite',emoji:'',description:'Haute visibilite',prix_base:1600,actif:true,ordre:4},
      {id:'5',nom:'Casquette',emoji:'',description:'Broderie structuree',prix_base:1200,actif:true,ordre:5},
      {id:'6',nom:'Totebag',emoji:'',description:'Coton canvas DTF',prix_base:950,actif:true,ordre:6},
      {id:'7',nom:'Tablier',emoji:'',description:'Cuisine ou commerce',prix_base:1500,actif:true,ordre:7},
    ]
    const fallbackCouleurs = [
      {id:'1',  nom:'Noir',           hex:'#1A1A1A', actif:true, ordre:1,  produits:['T-shirt','T-shirt Oversized 250GSM','Polo','Gilet de travail','Casquette','Totebag','Tablier']},
      {id:'2',  nom:'Blanc',          hex:'#FFFFFF', actif:true, ordre:2,  produits:['T-shirt','T-shirt Oversized 250GSM','Polo','Casquette','Totebag']},
      {id:'3',  nom:'Rouge',          hex:'#CC1111', actif:true, ordre:3,  produits:['T-shirt','T-shirt Oversized 250GSM','Polo','Gilet de travail','Casquette','Tablier']},
      {id:'4',  nom:'Orange',         hex:'#E8621A', actif:true, ordre:4,  produits:['T-shirt','T-shirt Oversized 250GSM','Casquette']},
      {id:'5',  nom:'Bleu Nuit',      hex:'#1B2A4A', actif:true, ordre:5,  produits:['Polo','Gilet de travail','Casquette']},
      {id:'6',  nom:'Bleu Roi',       hex:'#1A5DC8', actif:true, ordre:6,  produits:['T-shirt','T-shirt Oversized 250GSM','Casquette']},
      {id:'7',  nom:'Bleu Ciel',      hex:'#87CEEB', actif:true, ordre:7,  produits:['T-shirt','T-shirt Oversized 250GSM']},
      {id:'8',  nom:'Vert',           hex:'#1A9A3C', actif:true, ordre:8,  produits:['T-shirt','T-shirt Oversized 250GSM','Casquette']},
      {id:'9',  nom:'Bordeaux',       hex:'#6B1A2A', actif:true, ordre:9,  produits:['T-shirt','T-shirt Oversized 250GSM']},
      {id:'10', nom:'Jaune',          hex:'#F5C200', actif:true, ordre:10, produits:['T-shirt','T-shirt Oversized 250GSM']},
      {id:'11', nom:'Rose',           hex:'#F5A0B5', actif:true, ordre:11, produits:['T-shirt','T-shirt Oversized 250GSM']},
      {id:'12', nom:'Beige',          hex:'#E8D5B0', actif:true, ordre:12, produits:['T-shirt','T-shirt Oversized 250GSM','Gilet de travail','Totebag']},
      {id:'13', nom:'Gris',           hex:'#888888', actif:true, ordre:13, produits:['T-shirt','T-shirt Oversized 250GSM']},
      {id:'14', nom:'Gris Clair',     hex:'#C8C8C8', actif:true, ordre:14, produits:['T-shirt','T-shirt Oversized 250GSM']},
      {id:'15', nom:'Gris Fonce',     hex:'#3A3A3A', actif:true, ordre:15, produits:['T-shirt','T-shirt Oversized 250GSM']},
    ]
    const fallbackTailles = [
      {id:'1',nom:'XS',actif:true,ordre:1},
      {id:'2',nom:'S',actif:true,ordre:2},
      {id:'3',nom:'M',actif:true,ordre:3},
      {id:'4',nom:'L',actif:true,ordre:4},
      {id:'5',nom:'XL',actif:true,ordre:5},
      {id:'6',nom:'XXL',actif:true,ordre:6},
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

  useEffect(() => {
    if (produits.length === 0 || couleurs.length === 0) return
    const params = new URLSearchParams(window.location.search)
    const produitNom = params.get('produit')
    const couleurNom = params.get('couleur')
    if (!produitNom) return
    const matchProduit = produits.find(p => p.nom === produitNom)
    const matchCouleur = couleurs.find(c => c.nom === couleurNom)
    setOrder(prev => ({
      ...prev,
      produit: matchProduit ?? prev.produit,
      couleur: couleurNom ?? prev.couleur,
      couleurHex: matchCouleur?.hex ?? prev.couleurHex,
      step: 2,
    }))
    try {
      const raw = sessionStorage.getItem('designer_layers')
      if (raw) {
        const layers = JSON.parse(raw)
        if (Array.isArray(layers) && layers.length > 0) {
          const first = layers[0]
          fetch(first.src)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], first.name || 'logo-designer.png', { type: blob.type })
              setOrder(prev => ({ ...prev, logoFile: file, logoUrl: first.src }))
            })
            .catch(() => {})
        }
        sessionStorage.removeItem('designer_layers')
      }
    } catch (e) {
      console.warn('Impossible de restaurer le logo du designer:', e)
    }
    setFromDesigner(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [produits, couleurs])

  const up = (patch: Partial<OrderState>) => setOrder(prev => ({...prev,...patch}))

  const calcPrice = () => {
    if (!order.produit) return {unit:0,total:0,remise:0}
    const r = order.quantite >= 100 ? 0.10 : order.quantite >= 50 ? 0.05 : 0
    const unit = Math.round(order.produit.prix_base * (1-r))
    return {unit, total: unit * order.quantite, remise: r}
  }

  const next = () => { up({step: order.step+1}); window.scrollTo({top:0,behavior:'smooth'}) }
  const prev = () => { up({step: order.step-1}); window.scrollTo({top:0,behavior:'smooth'}) }

  const handleFile = async (file: File) => {
    if (file.type.startsWith('image/')) {
      const r = new FileReader()
      r.onload = e => up({logoFile:file, logoUrl: e.target?.result as string})
      r.readAsDataURL(file)
    } else {
      up({logoFile:file, logoUrl:null})
    }
    setUploadingLogo(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload-logo', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) up({ logoUploadUrl: data.url })
    } catch (e) {
      console.error('Logo upload failed', e)
    }
    setUploadingLogo(false)
  }

  const handleSubmit = async () => {
    if (!order.nom || !order.telephone) return alert('Nom et telephone requis.')
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
        logo_url: order.logoUploadUrl,
        prix_unitaire: unit,
        prix_total: total,
      })
    })

    // Générer le message WhatsApp
    const msg =
`Bonjour Caractère Store 👋

*Nouvelle commande — ${ref}*

🛍️ Produit : ${order.produit?.nom}
🎨 Couleur : ${order.couleur}
📏 Tailles : ${order.tailles.join(', ')}
📦 Quantité : ${order.quantite} pièce${order.quantite > 1 ? 's' : ''}
🖨️ Technique : ${order.technique}
📍 Position : ${order.position}${order.urgent ? '\n⚡ COMMANDE URGENTE' : ''}

👤 Nom : ${order.nom}
🏢 Entreprise : ${order.entreprise || 'Particulier'}
📞 Téléphone : ${order.telephone}
📧 Email : ${order.email || '-'}${order.notes ? `\n📝 Notes : ${order.notes}` : ''}

💰 Total estimé : ${total.toLocaleString('fr-FR')} DA`

    setRefCode(ref)
    setLoading(false)
    up({ step: 6, whatsappMsg: msg })
    window.scrollTo({top:0,behavior:'smooth'})
  }

  const {unit, total, remise} = calcPrice()
  const stepLabels = ['Produit','Couleurs','Logo','Contact']

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
                      {done?'v':s}
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
            <div className="text-[22px] font-bold font-mono bg-brand-light rounded-2xl px-6 py-3 inline-block mb-6 tracking-widest">
              {refCode}
            </div>
            <p className="text-[14px] text-brand-gray leading-relaxed mb-8">
              Confirmez maintenant votre commande sur WhatsApp — notre équipe vous répond sous 2h.
            </p>

            {/* BOUTON WHATSAPP */}
            <a
              href={`https://wa.me/213557440522?text=${encodeURIComponent(order.whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 rounded-full text-[16px] font-bold transition-colors shadow-lg shadow-green-200 mb-4 w-full justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Confirmer sur WhatsApp
            </a>

            <div className="bg-brand-light rounded-2xl p-4 text-left mb-6">
              <div className="text-[11px] font-bold tracking-widest text-brand-gray mb-3 uppercase">Récapitulatif</div>
              {[
                ['Produit', order.produit?.nom ?? '-'],
                ['Couleur', order.couleur],
                ['Tailles', order.tailles.join(', ')],
                ['Quantité', `${order.quantite} pièce${order.quantite > 1 ? 's' : ''}`],
                ['Technique', order.technique],
                ['Total estimé', `${total.toLocaleString('fr-FR')} DA`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-black/[0.06] last:border-0">
                  <span className="text-[12px] text-brand-gray">{label}</span>
                  <span className="text-[12px] font-semibold text-brand-dark">{val}</span>
                </div>
              ))}
            </div>

            <a
              href={`/suivi/${refCode}`}
              className="inline-block mb-4 text-[13px] font-semibold text-brand-dark underline"
            >
              Voir le suivi + infos paiement
            </a>
            <br />
            <button
              onClick={() => { setOrder(DEFAULT); setRefCode('') }}
              className="text-[13px] text-brand-gray underline bg-transparent border-none cursor-pointer"
            >
              Nouvelle commande
            </button>
          </div>
        ) : (
          <div className="max-w-[900px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">

              {fromDesigner && order.step === 2 && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="text-[13px] text-green-800">
                    <strong>{order.produit?.nom}</strong> {order.couleur} avec votre logo depuis le Designer.
                  </div>
                </div>
              )}

              {order.step === 1 && (
                <div>
                  <div className="text-[22px] font-bold tracking-tight mb-1">Choisissez votre produit</div>
                  <div className="text-[14px] text-brand-gray mb-8">Selectionnez le type de textile a personnaliser</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {produits.map(p => {
                      const BASE = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image'
                      const imgs: Record<string,string> = {
                        'T-shirt': BASE + '/IMG_5850.jpeg',
                        'T-shirt Oversized 250GSM': BASE + '/tshirt-oversized.jpeg',
                        'Polo': BASE + '/IMG_5851.jpeg',
                        'Casquette': BASE + '/IMG_5853.jpeg',
                        'Totebag': BASE + '/IMG_5854.jpeg',
                        'Gilet de travail': BASE + '/IMG_5852.jpeg',
                        'Gilet de securite': BASE + '/images.jpg',
                        'Tablier': BASE + '/png-clipart-apron-apron-thumbnail.png',
                      }
                      const imgUrl = imgs[p.nom] || BASE + '/IMG_5509.png'
                      return (
                        <button key={p.id} onClick={() => up({produit:p, step:2})} className={`text-left rounded-2xl border-2 transition-all cursor-pointer bg-white overflow-hidden ${order.produit?.id===p.id?'border-brand-dark':'border-black/10 hover:border-black/25'}`}>
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
                </div>
              )}

              {order.step === 2 && (
                <div>
                  <div className="text-[22px] font-bold tracking-tight mb-1">Couleur, Tailles & Quantite</div>
                  <div className="text-[14px] text-brand-gray mb-8">Choisissez la couleur, les tailles et la quantite</div>

                  <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray block mb-4">Couleur du textile</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {couleurs
                      .filter(c => !order.produit || !c.produits || c.produits.length === 0 || c.produits.includes(order.produit.nom))
                      .map(c => (
                      <button key={c.id} onClick={() => up({couleur:c.nom, couleurHex:c.hex})} title={c.nom} className={`w-9 h-9 rounded-full border-2 transition-all ${order.couleur===c.nom?'border-brand-dark scale-110':'border-transparent hover:border-black/20'}`} style={{background:c.hex, boxShadow:c.hex==='#FFFFFF'?'inset 0 0 0 1px rgba(0,0,0,0.12)':'none'}} />
                    ))}
                  </div>
                  <div className="text-[13px] text-brand-gray mb-8">Couleur : <strong className="text-brand-dark">{order.couleur}</strong></div>

                  <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray block mb-4">Tailles (multi-selection)</label>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {tailles.map(t => (
                      <button key={t.id} onClick={() => { const s=order.tailles.includes(t.nom)?order.tailles.filter(x=>x!==t.nom):[...order.tailles,t.nom]; up({tailles:s}) }} className={`px-4 py-2 rounded-xl text-[13px] font-medium border transition-all ${order.tailles.includes(t.nom)?'bg-brand-dark text-white border-brand-dark':'bg-white text-brand-dark border-black/15 hover:border-black/30'}`}>{t.nom}</button>
                    ))}
                  </div>

                  <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray block mb-3">Quantite</label>
                  <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => up({quantite:Math.max(1,order.quantite-1)})} className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-[18px] bg-white">-</button>
                    <input type="number" value={order.quantite} min={1} onChange={e => up({quantite:Math.max(1,parseInt(e.target.value)||1)})} className="w-20 text-center text-[18px] font-bold border border-black/20 rounded-xl py-2 focus:outline-none" />
                    <button onClick={() => up({quantite:order.quantite+1})} className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-[18px] bg-white">+</button>
                  </div>
                  {order.quantite >= 50 && <div className="mb-6 text-[13px] font-medium text-green-700 bg-green-50 px-4 py-2 rounded-xl inline-block">{order.quantite>=100?'-10%':'-5%'} applique</div>}

                  <div className="flex gap-3 mt-4">
                    <button onClick={prev} className="px-6 py-3 rounded-full border border-black/20 text-[14px] font-medium">Retour</button>
                    <button onClick={next} className="bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors">Continuer</button>
                  </div>
                </div>
              )}

              {order.step === 3 && (
                <div>
                  <div className="text-[22px] font-bold tracking-tight mb-1">Votre logo</div>
                  <div className="text-[14px] text-brand-gray mb-8">
                    {fromDesigner ? 'Logo recupere depuis le Designer.' : 'Uploadez votre logo pour la personnalisation'}
                  </div>
                  <div className="border-2 border-dashed border-black/20 rounded-2xl p-12 text-center mb-6 cursor-pointer hover:border-black/40 transition-colors bg-brand-light/50" onClick={() => fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f)}}>
                    <div className="text-[15px] font-medium mb-1">Glissez votre logo ici</div>
                    <div className="text-[13px] text-brand-gray">ou cliquez pour parcourir</div>
                    <div className="text-[11px] text-brand-gray/70 mt-2">AI - EPS - SVG - PDF - PNG - JPG</div>
                    <input ref={fileRef} type="file" className="hidden" accept=".ai,.eps,.svg,.pdf,.png,.jpg,.jpeg" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f)}} />
                  </div>
                  {uploadingLogo && <div className="text-[13px] text-brand-gray mb-4">Upload en cours...</div>}
                  {order.logoFile && (
                    <div className="bg-white border border-black/10 rounded-2xl p-4 flex items-center gap-4 mb-4">
                      {order.logoUrl && <img src={order.logoUrl} alt="Logo" className="w-16 h-16 object-contain rounded-xl bg-brand-light" />}
                      <div className="flex-1"><div className="text-[14px] font-semibold">{order.logoFile.name}</div><div className="text-[12px] text-brand-gray">{(order.logoFile.size/1024).toFixed(0)} Ko</div></div>
                      <button onClick={() => up({logoFile:null,logoUrl:null})} className="text-[12px] text-red-500 font-medium">Supprimer</button>
                    </div>
                  )}
                  <p className="text-[13px] text-brand-gray mb-8">Pas de logo ? Notre equipe vectorise gratuitement.</p>
                  <div className="flex gap-3">
                    <button onClick={prev} className="px-6 py-3 rounded-full border border-black/20 text-[14px] font-medium">Retour</button>
                    <button onClick={() => { up({step: 5}); window.scrollTo({top:0,behavior:'smooth'}) }} className="bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors">Continuer</button>
                  </div>
                </div>
              )}

              {order.step === 5 && (
                <div>
                  <div className="text-[22px] font-bold tracking-tight mb-1">Vos coordonnees</div>
                  <div className="text-[14px] text-brand-gray mb-8">Derniere etape — on vous contacte sous 24h</div>
                  <div className="flex flex-col gap-4 max-w-[480px]">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Nom complet *</label><input type="text" value={order.nom} onChange={e=>up({nom:e.target.value})} placeholder="Votre nom" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none" /></div>
                      <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Entreprise</label><input type="text" value={order.entreprise} onChange={e=>up({entreprise:e.target.value})} placeholder="Nom entreprise" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Telephone *</label><input type="tel" value={order.telephone} onChange={e=>up({telephone:e.target.value})} placeholder="+213 6XX XXX XXX" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none" /></div>
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
                    <button onClick={() => { up({step: 3}); window.scrollTo({top:0,behavior:'smooth'}) }} className="px-6 py-3 rounded-full border border-black/20 text-[14px] font-medium">Retour</button>
                    <a
                      href={(!order.nom || !order.telephone) ? '#' : `https://wa.me/213557440522?text=${encodeURIComponent(
`Bonjour Caractère Store 👋

🛍️ Produit : ${order.produit?.nom}
🎨 Couleur : ${order.couleur}
📏 Tailles : ${order.tailles.join(', ')}
📦 Quantité : ${order.quantite} pièce${order.quantite > 1 ? 's' : ''}
🖨️ Technique : ${order.technique}
📍 Position : ${order.position}${order.urgent ? '\n⚡ COMMANDE URGENTE' : ''}

👤 Nom : ${order.nom}
🏢 Entreprise : ${order.entreprise || 'Particulier'}
📞 Téléphone : ${order.telephone}
📧 Email : ${order.email || '-'}${order.notes ? `\n📝 Notes : ${order.notes}` : ''}

💰 Total estimé : ${total.toLocaleString('fr-FR')} DA`
                      )}`}
                      onClick={(e) => {
                        if (!order.nom || !order.telephone) {
                          e.preventDefault()
                          alert('Nom et téléphone requis.')
                          return
                        }
                        handleSubmit()
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-3.5 rounded-full text-[15px] font-semibold transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Confirmer sur WhatsApp
                    </a>
                  </div>
                </div>
              )}

            </div>

            <div className="hidden lg:block">
              <div className="bg-brand-light rounded-[20px] p-6 sticky top-32">
                <div className="text-[13px] font-bold tracking-widest uppercase text-brand-gray mb-5">Resume</div>
                <div className="flex flex-col gap-0">
                  {[
                    {l:'Produit',v:order.produit?.nom ?? '-',e:!order.produit},
                    {l:'Quantite',v:`${order.quantite} pieces`},
                    {l:'Couleur',v:order.couleur},
                    {l:'Tailles',v:order.tailles.length ? order.tailles.join(', ') : '-'},
                    {l:'Logo',v:order.logoFile ? order.logoFile.name : 'Non uploade',e:!order.logoFile},
                  ].map(r => (
                    <div key={r.l} className="flex justify-between py-2.5 border-b border-black/[0.06] last:border-b-0">
                      <span className="text-[12px] text-brand-gray">{r.l}</span>
                      <span className={`text-[12px] font-medium text-right max-w-[140px] ${r.e?'text-brand-gray':'text-brand-dark'}`}>{r.v}</span>
                    </div>
                  ))}
                </div>
                {order.produit && (
                  <div className="mt-5 pt-5 border-t border-black/[0.08]">
                    {remise > 0 && <div className="text-[11px] text-green-700 font-medium mb-2">Remise {Math.round(remise*100)}% appliquee</div>}
                    <div className="flex justify-between items-baseline mb-1"><span className="text-[12px] text-brand-gray">Prix unitaire</span><span className="text-[14px] font-semibold">{unit.toLocaleString('fr-FR')} DA</span></div>
                    <div className="flex justify-between items-baseline"><span className="text-[12px] text-brand-gray">Total estime</span><span className="text-[20px] font-bold tracking-tight">{total.toLocaleString('fr-FR')} DA</span></div>
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
