'use client'
import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import {
  TshirtMockup, PoloMockup, GiletMockup, CasquetteMockup,
  TotebagMockup, SweatMockup, TablierMockup, GiletSecuriteMockup,
  MOCKUP_MAP,
} from '@/components/designer/ProductMockups'

interface LogoLayer {
  id: string
  src: string
  x: number
  y: number
  scale: number
  rotation: number
}

/* ─── PALETTE COULEURS ──────────────────────────────────────────────────── */
const COLOR_PALETTE = [
  { name: 'Blanc',        hex: '#FFFFFF' },
  { name: 'Noir',         hex: '#1A1A1A' },
  { name: 'Gris',         hex: '#9CA3AF' },
  { name: 'Marine',       hex: '#1E3A5F' },
  { name: 'Royal',        hex: '#2563EB' },
  { name: 'Ciel',         hex: '#7DD3FC' },
  { name: 'Rouge',        hex: '#DC2626' },
  { name: 'Bordeaux',     hex: '#7F1D1D' },
  { name: 'Vert foncé',   hex: '#14532D' },
  { name: 'Vert bouteille', hex: '#166534' },
  { name: 'Kaki',         hex: '#78716C' },
  { name: 'Beige',        hex: '#D6B99A' },
  { name: 'Jaune',        hex: '#FCD34D' },
  { name: 'Orange',       hex: '#EA580C' },
  { name: 'Violet',       hex: '#7C3AED' },
  { name: 'Rose',         hex: '#EC4899' },
]

/* ─── PRODUITS ──────────────────────────────────────────────────────────── */
const PRODUCTS = [
  { id: 'tshirt',         name: 'T-shirt',         emoji: '👕', prix_base: 1800,
    printZone: { left: 30, top: 28, width: 40, height: 35 } },
  { id: 'polo',           name: 'Polo',            emoji: '👔', prix_base: 2200,
    printZone: { left: 30, top: 30, width: 40, height: 32 } },
  { id: 'gilet',          name: 'Gilet travail',   emoji: '🦺', prix_base: 2500,
    printZone: { left: 32, top: 28, width: 36, height: 30 } },
  { id: 'gilet_securite', name: 'Gilet sécu.',     emoji: '🟡', prix_base: 1500,
    printZone: { left: 33, top: 30, width: 34, height: 25 } },
  { id: 'casquette',      name: 'Casquette',       emoji: '🧢', prix_base: 1500,
    printZone: { left: 32, top: 22, width: 36, height: 32 } },
  { id: 'totebag',        name: 'Totebag',         emoji: '👜', prix_base: 1200,
    printZone: { left: 28, top: 32, width: 44, height: 42 } },
  { id: 'sweat',          name: 'Sweat',           emoji: '🧥', prix_base: 3200,
    printZone: { left: 30, top: 28, width: 40, height: 35 } },
  { id: 'tablier',        name: 'Tablier',         emoji: '🍽️', prix_base: 1500,
    printZone: { left: 36, top: 34, width: 28, height: 30 } },
]

function calcPrice(prixBase: number, qty: number) {
  const remise = qty >= 100 ? 0.10 : qty >= 50 ? 0.05 : 0
  const unit = Math.round(prixBase * (1 - remise))
  return { unit, total: unit * qty, remise }
}

/* ─── COMPOSANT INNER (uses useSearchParams) ────────────────────────────── */
function DesignerInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialProductId = searchParams.get('product') || 'tshirt'
  const initialProduct = PRODUCTS.find(p => p.id === initialProductId) || PRODUCTS[0]

  const [product, setProduct] = useState(initialProduct)
  const [color, setColor] = useState('#FFFFFF')
  const [layers, setLayers] = useState<LogoLayer[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const action = useRef<{ type: 'move'|'resize'|'rotate'|null, id: string, startX: number, startY: number, layer: LogoLayer } | null>(null)

  const [checkout, setCheckout] = useState(false)
  const [qty, setQty] = useState(10)
  const [nom, setNom] = useState('')
  const [tel, setTel] = useState('')
  const [entreprise, setEntreprise] = useState('')
  const [loading, setLoading] = useState(false)
  const [refCode, setRefCode] = useState<string | null>(null)
  const [colorLabel, setColorLabel] = useState('Blanc')

  const { unit, total, remise } = calcPrice(product.prix_base, qty)
  const MockupComponent = MOCKUP_MAP[product.id] || TshirtMockup
  const pz = product.printZone

  // Update URL when product changes
  const handleProductChange = (p: typeof PRODUCTS[0]) => {
    setProduct(p)
    setLayers([])
    setActiveId(null)
    router.replace(`/designer?product=${p.id}`, { scroll: false })
  }

  const addLogo = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const id = Date.now().toString(36)
      const layer: LogoLayer = {
        id, src: e.target?.result as string,
        x: pz.left + pz.width / 2,
        y: pz.top + pz.height / 2,
        scale: 1, rotation: 0,
      }
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
    setLayers(prev => [...prev, { ...l, id: newId, x: Math.min(90, l.x + 4), y: Math.min(90, l.y + 4) }])
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
    const BASE_W = 110
    if (a.type === 'move') {
      updateLayer(a.id, {
        x: Math.min(92, Math.max(8, a.layer.x + (dx / rect.width) * 100)),
        y: Math.min(92, Math.max(8, a.layer.y + (dy / rect.height) * 100)),
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
    await fetch('/api/commandes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference: ref,
        produit: product.name,
        quantite: qty,
        couleur: colorLabel,
        tailles: [],
        position: 'Centre poitrine',
        technique: 'DTF',
        urgent: false,
        nom_client: nom,
        entreprise,
        telephone: tel,
        email: '',
        notes: 'Commande via Designer',
        logo_url: layers[0]?.src || null,
        prix_unitaire: unit,
        prix_total: total,
      }),
    })
    setRefCode(ref)
    setLoading(false)
  }

  const BASE_W = 110

  /* ─── Confirmation ─────────────────────────────────────────────────────── */
  if (refCode) {
    return (
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
          <a href={`/suivi/${refCode}`}
            className="inline-block mb-6 bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors no-underline">
            Voir le suivi + infos paiement →
          </a>
        </div>
      </main>
    )
  }

  /* ─── Main ─────────────────────────────────────────────────────────────── */
  return (
    <main
      className="pt-14 min-h-screen bg-white"
      onPointerMove={onPointerMove}
      onPointerUp={() => { action.current = null }}
    >
      <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-8 md:py-10">

        <div className="mb-6">
          <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-1">Designer</span>
          <h1 className="text-[26px] md:text-[32px] font-bold tracking-tight text-brand-dark">Créez votre design.</h1>
          <p className="text-[13px] text-brand-gray mt-1">Choisissez un produit, une couleur, uploadez votre logo.</p>
        </div>

        {/* ── Product selector ── */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {PRODUCTS.map(p => (
            <button
              key={p.id}
              onClick={() => handleProductChange(p)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${
                product.id === p.id
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-white text-brand-dark border-black/15 hover:border-black/30'
              }`}
            >
              {p.emoji} {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          {/* ── CANVAS ── */}
          <div>
            {/* Color picker */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-gray mb-2">
                Couleur du produit
              </p>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTE.map(c => (
                  <button
                    key={c.hex}
                    title={c.name}
                    onClick={() => { setColor(c.hex); setColorLabel(c.name) }}
                    className={`w-8 h-8 rounded-full transition-all border-2 ${
                      color === c.hex ? 'border-brand-dark scale-110 shadow-md' : 'border-black/15 hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: c.hex,
                      boxShadow: c.hex === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined,
                    }}
                  />
                ))}
              </div>
              <p className="text-[12px] text-brand-gray mt-1.5">{colorLabel}</p>
            </div>

            {/* Mockup stage */}
            <div
              ref={stageRef}
              onClick={() => setActiveId(null)}
              className="relative w-full aspect-square bg-[#f8f8f8] rounded-[24px] overflow-hidden select-none border border-black/[0.06] flex items-center justify-center"
            >
              {/* SVG Mockup */}
              <MockupComponent color={color} className="absolute inset-0 w-full h-full p-4 pointer-events-none" />

              {/* Print zone guide */}
              {layers.length === 0 && (
                <div
                  className="absolute border-2 border-dashed border-black/20 rounded-lg flex items-center justify-center pointer-events-none"
                  style={{
                    left: `${pz.left}%`, top: `${pz.top}%`,
                    width: `${pz.width}%`, height: `${pz.height}%`,
                  }}
                >
                  <span className="text-[10px] font-semibold text-black/40 bg-white/80 px-2 py-0.5 rounded tracking-wide">
                    Zone d'impression
                  </span>
                </div>
              )}

              {/* Logo layers */}
              {layers.map(layer => {
                const isActive = layer.id === activeId
                const w = BASE_W * layer.scale
                return (
                  <div
                    key={layer.id}
                    onClick={e => e.stopPropagation()}
                    onPointerDown={e => startAction('move', layer.id, e)}
                    className="absolute cursor-move touch-none"
                    style={{
                      left: `${layer.x}%`, top: `${layer.y}%`,
                      width: w, height: w,
                      transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                    }}
                  >
                    <img
                      src={layer.src} alt="logo"
                      className="w-full h-full object-contain pointer-events-none drop-shadow-lg"
                      draggable={false}
                    />
                    {isActive && (
                      <>
                        <div className="absolute inset-0 border-2 border-brand-dark rounded pointer-events-none" />
                        <button
                          onPointerDown={e => e.stopPropagation()}
                          onClick={e => { e.stopPropagation(); removeLayer(layer.id) }}
                          className="absolute -top-3 -left-3 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-md hover:bg-red-600"
                        >×</button>
                        <button
                          onPointerDown={e => e.stopPropagation()}
                          onClick={e => { e.stopPropagation(); duplicateLayer(layer.id) }}
                          className="absolute -top-3 -right-3 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[12px] shadow-md hover:bg-brand-light"
                          title="Dupliquer"
                        >⧉</button>
                        <div
                          onPointerDown={e => startAction('rotate', layer.id, e)}
                          className="absolute -bottom-3 -left-3 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[13px] shadow-md cursor-grab active:cursor-grabbing"
                          title="Rotation"
                        >↻</div>
                        <div
                          onPointerDown={e => startAction('resize', layer.id, e)}
                          className="absolute -bottom-3 -right-3 w-7 h-7 bg-brand-dark rounded-full flex items-center justify-center text-white text-[12px] shadow-md cursor-nwse-resize"
                          title="Redimensionner"
                        >⤡</div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Upload button */}
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-3 w-full border-2 border-dashed border-black/20 rounded-2xl p-5 text-center cursor-pointer hover:border-black/40 transition-colors bg-brand-light/50"
            >
              <div className="text-[24px] mb-0.5">📁</div>
              <div className="text-[13px] font-medium">Ajouter un logo</div>
              <div className="text-[11px] text-brand-gray mt-0.5">PNG, SVG, JPG • fond transparent recommandé</div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) addLogo(f) }} />
            </button>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="flex flex-col gap-5">

            <div className="bg-brand-light rounded-2xl p-4 text-[13px] space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-gray mb-2">Instructions</p>
              <p className="text-brand-dark/70 leading-relaxed">
                Glissez votre logo pour le positionner. Utilisez les poignées aux coins pour
                <span className="font-medium"> supprimer ×</span>,
                <span className="font-medium"> dupliquer ⧉</span>,
                <span className="font-medium"> tourner ↻</span> ou
                <span className="font-medium"> redimensionner ⤡</span>.
              </p>
            </div>

            {/* Estimation */}
            <div className="bg-brand-light rounded-2xl p-4 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-gray">Estimation</p>

              <div className="flex justify-between text-[13px]">
                <span className="text-brand-gray">Produit</span>
                <span className="font-medium">{product.emoji} {product.name}</span>
              </div>

              <div className="flex justify-between text-[13px]">
                <span className="text-brand-gray">Couleur</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black/15 inline-block"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium">{colorLabel}</span>
                </div>
              </div>

              <div className="flex justify-between text-[13px] items-center">
                <span className="text-brand-gray">Quantité</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-6 h-6 rounded-full bg-white border border-black/15 text-[14px] flex items-center justify-center">−</button>
                  <span className="font-medium w-8 text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="w-6 h-6 rounded-full bg-white border border-black/15 text-[14px] flex items-center justify-center">+</button>
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
              <p className="text-[11px] text-brand-gray">{unit.toLocaleString('fr-FR')} DA / pièce</p>
            </div>

            {/* CTA */}
            {!checkout ? (
              <div className="space-y-2">
                <button
                  onClick={() => setCheckout(true)}
                  disabled={layers.length === 0}
                  className={`w-full bg-brand-dark text-white px-7 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors ${layers.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  Commander →
                </button>
                {layers.length === 0 && (
                  <p className="text-[12px] text-brand-gray text-center">Ajoutez un logo pour commander</p>
                )}
                <a
                  href={`https://wa.me/213557440522?text=Bonjour, je veux personnaliser un ${product.name} couleur ${colorLabel}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-black/15 text-brand-dark px-7 py-3 rounded-full text-[14px] font-medium hover:border-black/30 transition-colors no-underline"
                >
                  💬 Demander un devis WhatsApp
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[14px] font-semibold text-brand-dark">Vos informations</p>
                <input placeholder="Nom complet *" value={nom} onChange={e => setNom(e.target.value)}
                  className="w-full border border-black/15 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand-dark" />
                <input placeholder="Téléphone *" value={tel} onChange={e => setTel(e.target.value)}
                  className="w-full border border-black/15 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand-dark" />
                <input placeholder="Entreprise (optionnel)" value={entreprise} onChange={e => setEntreprise(e.target.value)}
                  className="w-full border border-black/15 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-brand-dark" />

                <div className="bg-brand-light rounded-xl px-4 py-3 text-[13px] flex justify-between">
                  <span>{product.name} × {qty} ({colorLabel})</span>
                  <span className="font-bold">{total.toLocaleString('fr-FR')} DA</span>
                </div>

                <button onClick={handleOrder} disabled={loading}
                  className="w-full bg-brand-dark text-white px-7 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50">
                  {loading ? 'Envoi...' : 'Confirmer la commande →'}
                </button>
                <button onClick={() => setCheckout(false)}
                  className="w-full text-[13px] text-brand-gray text-center underline">
                  Retour au design
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}

/* ─── PAGE EXPORT (Suspense requis pour useSearchParams) ────────────────── */
export default function DesignerPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="pt-14 min-h-screen bg-white flex items-center justify-center"><p className="text-brand-gray">Chargement du designer...</p></div>}>
        <DesignerInner />
      </Suspense>
    </>
  )
}
