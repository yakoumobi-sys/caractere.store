'use client'
import { useState, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'

interface LogoLayer {
  id: string
  src: string
  x: number
  y: number
  scale: number
  rotation: number
}

const BASE = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image'

const PRODUCTS = [
  { id: 'tshirt',    name: 'T-shirt',   img: BASE + '/mockup-tshirt-blanc.jpg',  prix_base: 1800 },
  { id: 'polo',      name: 'Polo',      img: BASE + '/mockup-polo-blanc.jpg',    prix_base: 2200 },
  { id: 'gilet',     name: 'Gilet',     img: BASE + '/mockup-gilet.jpg',         prix_base: 2500 },
  { id: 'casquette', name: 'Casquette', img: BASE + '/mockup-casquette.jpg',     prix_base: 1500 },
  { id: 'totebag',   name: 'Totebag',   img: BASE + '/mockup-totebag.jpg',       prix_base: 1200 },
]

const PRINT_ZONE = { left: 28, top: 20, width: 44, height: 40 }
const BASE_W = 120

function calcPrice(prixBase: number, qty: number) {
  const remise = qty >= 100 ? 0.10 : qty >= 50 ? 0.05 : 0
  const unit = Math.round(prixBase * (1 - remise))
  return { unit, total: unit * qty, remise }
}

export default function DesignerPage() {
  const [product, setProduct] = useState(PRODUCTS[0])
  const [layers, setLayers] = useState<LogoLayer[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const action = useRef<{ type: 'move'|'resize'|'rotate'|null, id: string, startX: number, startY: number, layer: LogoLayer } | null>(null)

  // Mini-checkout state
  const [checkout, setCheckout] = useState(false)
  const [qty, setQty] = useState(10)
  const [nom, setNom] = useState('')
  const [tel, setTel] = useState('')
  const [entreprise, setEntreprise] = useState('')
  const [loading, setLoading] = useState(false)
  const [refCode, setRefCode] = useState<string | null>(null)

  const active = layers.find(l => l.id === activeId) || null
  const { unit, total, remise } = calcPrice(product.prix_base, qty)

  const addLogo = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const id = Date.now().toString(36)
      const layer: LogoLayer = { id, src: e.target?.result as string, x: 50, y: 45, scale: 1, rotation: 0 }
      setLayers(prev => [...prev, layer])
      setActiveId(id)
    }
    reader.readAsDataURL(file)
  }

  const updateLayer = (id: string, patch: Partial<LogoLayer>) =>
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))

  const removeLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const duplicateLayer = (id: string) => {
    const l = layers.find(x => x.id === id)
    if (!l) return
    const newId = Date.now().toString(36)
    setLayers(prev => [...prev, { ...l, id: newId, x: Math.min(90, l.x + 5), y: Math.min(90, l.y + 5) }])
    setActiveId(newId)
  }

  const startAction = (type: 'move'|'resize'|'rotate', id: string, e: React.PointerEvent) => {
    e.stopPropagation()
    const l = layers.find(x => x.id === id)
    if (!l) return
    setActiveId(id)
    action.current = { type, id, startX: e.clientX, startY: e.clientY, layer: { ...l } }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const a = action.current
    if (!a || !stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const dx = e.clientX - a.startX
    const dy = e.clientY - a.startY
    if (a.type === 'move') {
      updateLayer(a.id, {
        x: Math.min(95, Math.max(5, a.layer.x + (dx / rect.width) * 100)),
        y: Math.min(95, Math.max(5, a.layer.y + (dy / rect.height) * 100)),
      })
    } else if (a.type === 'resize') {
      updateLayer(a.id, { scale: Math.min(3, Math.max(0.2, a.layer.scale + (dx + dy) / 2 / 100)) })
    } else if (a.type === 'rotate') {
      const cx = rect.left + (a.layer.x / 100) * rect.width
      const cy = rect.top + (a.layer.y / 100) * rect.height
      const deltaDeg = (Math.atan2(e.clientY - cy, e.clientX - cx) - Math.atan2(a.startY - cy, a.startX - cx)) * (180 / Math.PI)
      updateLayer(a.id, { rotation: Math.round(a.layer.rotation + deltaDeg) })
    }
  }

  const handleOrder = async () => {
    if (!nom || !tel) return alert('Nom et téléphone requis.')
    setLoading(true)
    const ref = 'POD-' + Date.now().toString(36).toUpperCase()
    const logoUrl = layers[0]?.src || null

    await fetch('/api/commandes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference: ref,
        produit: product.name,
        quantite: qty,
        couleur: 'Blanc',
        tailles: [],
        position: 'Centre poitrine',
        technique: 'DTF',
        urgent: false,
        nom_client: nom,
        entreprise: entreprise,
        telephone: tel,
        email: '',
        notes: 'Commande via Designer POD',
        logo_url: logoUrl,
        prix_unitaire: unit,
        prix_total: total,
      }),
    })
    setRefCode(ref)
    setLoading(false)
  }

  // ── Confirmation screen ──────────────────────────────────────────────────
  if (refCode) {
    return (
      <>
        <Navbar />
        <main className="pt-14 min-h-screen bg-white flex items-center justify-center">
          <div className="text-center py-20 max-w-[500px] mx-auto px-6">
            <div className="text-[64px] mb-6">✅</div>
            <h2 className="text-[28px] font-bold tracking-tight mb-3">Commande envoyée !</h2>
            <p className="text-[16px] text-brand-gray mb-2">Votre référence</p>
            <div className="text-[22px] font-bold font-mono bg-brand-light rounded-2xl px-6 py-3 inline-block mb-4 tracking-widest">
              {refCode}
            </div>
            <p className="text-[14px] text-brand-gray leading-relaxed mb-6">
              Notre équipe vous contacte sous 24h par WhatsApp.
            </p>
            <a
              href={`/suivi/${refCode}`}
              className="inline-block mb-6 bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors no-underline"
            >
              Voir le suivi + infos paiement →
            </a>
          </div>
        </main>
      </>
    )
  }

  // ── Main designer ────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen bg-white" onPointerMove={onPointerMove} onPointerUp={() => { action.current = null }}>
        <div className="max-w-[1100px] mx-auto px-6 py-10">

          <div className="mb-8">
            <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-2">Designer</span>
            <h1 className="text-[28px] md:text-[34px] font-bold tracking-tight text-brand-dark">Créez votre design.</h1>
            <p className="text-[14px] text-brand-gray mt-1">Choisissez un produit, uploadez votre logo et positionnez-le.</p>
          </div>

          {/* Product selector */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {PRODUCTS.map(p => (
              <button
                key={p.id}
                onClick={() => setProduct(p)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${product.id === p.id ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-brand-dark border-black/15 hover:border-black/30'}`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

            {/* CANVAS */}
            <div>
              <div
                ref={stageRef}
                onClick={() => setActiveId(null)}
                className="relative w-full aspect-square bg-brand-light rounded-[24px] overflow-hidden select-none border border-black/[0.06]"
              >
                <img src={product.img} alt={product.name} className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />

                {layers.length === 0 && (
                  <div
                    className="absolute border-2 border-dashed border-black/25 rounded-lg flex items-center justify-center pointer-events-none"
                    style={{ left: `${PRINT_ZONE.left}%`, top: `${PRINT_ZONE.top}%`, width: `${PRINT_ZONE.width}%`, height: `${PRINT_ZONE.height}%` }}
                  >
                    <span className="text-[11px] font-medium text-brand-dark/50 bg-white/70 px-2 py-1 rounded">Zone d'impression</span>
                  </div>
                )}

                {layers.map(layer => {
                  const isActive = layer.id === activeId
                  const w = BASE_W * layer.scale
                  return (
                    <div
                      key={layer.id}
                      onClick={e => e.stopPropagation()}
                      onPointerDown={e => startAction('move', layer.id, e)}
                      className="absolute cursor-move touch-none"
                      style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: w, height: w, transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)` }}
                    >
                      <img src={layer.src} alt="logo" className="w-full h-full object-contain pointer-events-none drop-shadow-md" draggable={false} />
                      {isActive && (
                        <>
                          <div className="absolute inset-0 border-2 border-brand-dark rounded pointer-events-none" />
                          <button onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); removeLayer(layer.id) }} className="absolute -top-3 -left-3 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-md hover:bg-red-600">×</button>
                          <button onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); duplicateLayer(layer.id) }} className="absolute -top-3 -right-3 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[12px] shadow-md hover:bg-brand-light" title="Dupliquer">⧉</button>
                          <div onPointerDown={e => startAction('rotate', layer.id, e)} className="absolute -bottom-3 -left-3 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[13px] shadow-md cursor-grab active:cursor-grabbing" title="Rotation">↻</div>
                          <div onPointerDown={e => startAction('resize', layer.id, e)} className="absolute -bottom-3 -right-3 w-7 h-7 bg-brand-dark rounded-full flex items-center justify-center text-white text-[12px] shadow-md cursor-nwse-resize" title="Redimensionner">⤡</div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              <button
                onClick={() => fileRef.current?.click()}
                className="mt-4 w-full border-2 border-dashed border-black/20 rounded-2xl p-6 text-center cursor-pointer hover:border-black/40 transition-colors bg-brand-light/50"
              >
                <div className="text-[28px] mb-1">📁</div>
                <div className="text-[14px] font-medium">Ajouter un logo</div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) addLogo(f) }} />
              </button>
            </div>

            {/* SIDEBAR */}
            <div className="flex flex-col gap-6">
              <p className="text-[13px] text-brand-gray leading-relaxed">
                Cliquez sur votre logo pour le sélectionner. Glissez pour déplacer. Utilisez les poignées aux coins pour supprimer, dupliquer, tourner ou redimensionner.
              </p>

              {/* Prix estimé */}
              {layers.length > 0 && (
                <div className="bg-brand-light rounded-2xl p-4 space-y-2">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-brand-gray">Estimation</p>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-brand-gray">Produit</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="flex justify-between text-[13px] items-center">
                    <span className="text-brand-gray">Quantité</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-6 h-6 rounded-full bg-white border border-black/15 text-[14px] flex items-center justify-center">−</button>
                      <span className="font-medium w-8 text-center">{qty}</span>
                      <button onClick={() => setQty(q => q + 1)} className="w-6 h-6 rounded-full bg-white border border-black/15 text-[14px] flex items-center justify-center">+</button>
                    </div>
                  </div>
                  {remise > 0 && (
                    <div className="flex justify-between text-[13px]">
                      <span className="text-green-600">Remise</span>
                      <span className="text-green-600 font-medium">−{remise * 100}%</span>
                    </div>
                  )}
                  <div className="h-px bg-black/10" />
                  <div className="flex justify-between text-[15px]">
                    <span className="font-semibold">Total estimé</span>
                    <span className="font-bold">{total.toLocaleString('fr-FR')} DA</span>
                  </div>
                  <p className="text-[11px] text-brand-gray">({unit.toLocaleString('fr-FR')} DA / pièce)</p>
                </div>
              )}

              {/* Mini-checkout */}
              {!checkout ? (
                <div className="pt-4 border-t border-black/[0.08]">
                  <button
                    onClick={() => setCheckout(true)}
                    disabled={layers.length === 0}
                    className={`w-full text-center bg-brand-dark text-white px-7 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors ${layers.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    Commander →
                  </button>
                  {layers.length === 0 && (
                    <p className="text-[12px] text-brand-gray text-center mt-2">Ajoutez un logo pour commander</p>
                  )}
                </div>
              ) : (
                <div className="pt-4 border-t border-black/[0.08] space-y-3">
                  <p className="text-[14px] font-semibold text-brand-dark">Vos informations</p>
                  <input
                    placeholder="Nom complet *"
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    className="w-full border border-black/15 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand-dark"
                  />
                  <input
                    placeholder="Téléphone *"
                    value={tel}
                    onChange={e => setTel(e.target.value)}
                    className="w-full border border-black/15 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand-dark"
                  />
                  <input
                    placeholder="Entreprise (optionnel)"
                    value={entreprise}
                    onChange={e => setEntreprise(e.target.value)}
                    className="w-full border border-black/15 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand-dark"
                  />

                  <div className="bg-brand-light rounded-xl px-4 py-3 text-[13px] flex justify-between">
                    <span>{product.name} × {qty}</span>
                    <span className="font-bold">{total.toLocaleString('fr-FR')} DA</span>
                  </div>

                  <button
                    onClick={handleOrder}
                    disabled={loading}
                    className="w-full bg-brand-dark text-white px-7 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Envoi...' : 'Confirmer la commande →'}
                  </button>
                  <button
                    onClick={() => setCheckout(false)}
                    className="w-full text-[13px] text-brand-gray text-center underline"
                  >
                    Retour au design
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
