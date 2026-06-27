'use client'
import { useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'

interface LogoLayer {
  id: string
  src: string
  x: number
  y: number
  scale: number
  rotation: number
}

/* ─── PALETTE COMPLÈTE ──────────────────────────────────────────────────── */
const ALL_COLORS = {
  blanc:    { name: 'Blanc',          hex: '#FFFFFF' },
  noir:     { name: 'Noir',           hex: '#1A1A1A' },
  marine:   { name: 'Marine',         hex: '#1E3A5F' },
  royal:    { name: 'Bleu roi',       hex: '#2563EB' },
  rouge:    { name: 'Rouge',          hex: '#DC2626' },
  vert:     { name: 'Vert',           hex: '#166534' },
  gris:     { name: 'Gris',           hex: '#6B7280' },
  beige:    { name: 'Beige',          hex: '#D6B99A' },
  bordeaux: { name: 'Bordeaux',       hex: '#7F1D1D' },
} as const

type ColorKey = keyof typeof ALL_COLORS

/* ─── PRODUITS avec couleurs disponibles ────────────────────────────────── */
const PRODUCTS = [
  {
    id: 'tshirt',
    name: 'T-shirt',
    emoji: '👕',
    prix_base: 1800,
    colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[],
  },
  {
    id: 'tshirt_oversized',
    name: 'Oversized 250GSM',
    emoji: '👕',
    prix_base: 3200,
    colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[],
  },
  {
    id: 'polo',
    name: 'Polo',
    emoji: '👔',
    prix_base: 2200,
    colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[],
  },
  {
    id: 'gilet',
    name: 'Gilet travail',
    emoji: '🦺',
    prix_base: 2500,
    colors: ['noir','rouge','beige','royal'] as ColorKey[],
  },
  {
    id: 'gilet_securite',
    name: 'Gilet sécu.',
    emoji: '🟡',
    prix_base: 1500,
    colors: ['blanc'] as ColorKey[],
  },
  {
    id: 'casquette',
    name: 'Casquette',
    emoji: '🧢',
    prix_base: 1500,
    colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[],
  },
  {
    id: 'totebag',
    name: 'Totebag',
    emoji: '👜',
    prix_base: 1200,
    colors: ['beige','noir'] as ColorKey[],
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    emoji: '🧥',
    prix_base: 3800,
    colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[],
  },
  {
    id: 'tablier',
    name: 'Tablier',
    emoji: '🍽️',
    prix_base: 1500,
    colors: ['noir','rouge','bordeaux'] as ColorKey[],
  },
]

/* ─── MOCKUP IMAGES (statiques — ne changent pas avec la couleur) ─────── */
const BASE = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockups'
function getMockup(productId: string): string {
  const map: Record<string, string> = {
    tshirt:           `${BASE}/tshirt_blanc.png`,
    tshirt_oversized: `${BASE}/tshirt_oversized_blanc.png`,
    polo:             `${BASE}/tshirt_blanc.png`,
    gilet:            `${BASE}/gilet_noir.png`,
    gilet_securite:   `${BASE}/gilet_securite_blanc.png`,
    casquette:        `${BASE}/casquette_noir.png`,
    totebag:          `${BASE}/totebag_blanc.png`,
    hoodie:           `${BASE}/hoodie_blanc.png`,
    tablier:          `${BASE}/tablier_noir.png`,
  }
  return map[productId] || `${BASE}/tshirt_blanc.png`
}

function calcPrice(prixBase: number, qty: number) {
  const remise = qty >= 100 ? 0.10 : qty >= 50 ? 0.05 : 0
  const unit = Math.round(prixBase * (1 - remise))
  return { unit, total: unit * qty, remise }
}

/* ─── INNER ─────────────────────────────────────────────────────────────── */
function DesignerInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialId = searchParams.get('product') || 'tshirt'
  const initialProduct = PRODUCTS.find(p => p.id === initialId) || PRODUCTS[0]

  const [product, setProduct] = useState(initialProduct)
  const [colorKey, setColorKey] = useState<ColorKey>(initialProduct.colors[0])
  const [layers, setLayers] = useState<LogoLayer[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')
  const [refCode, setRefCode] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const action = useRef<{
    type: 'move' | 'resize' | 'rotate'
    id: string; startX: number; startY: number; layer: LogoLayer
  } | null>(null)

  const { unit, total, remise } = calcPrice(product.prix_base, qty)
  const currentColor = ALL_COLORS[colorKey]
  const availableColors = product.colors.map(k => ({ key: k, ...ALL_COLORS[k] }))
  const mockupSrc = getMockup(product.id)

  const handleProductChange = (p: typeof PRODUCTS[0]) => {
    setProduct(p)
    setLayers([])
    setActiveId(null)
    // Reset couleur si pas dispo sur ce produit
    if (!p.colors.includes(colorKey)) setColorKey(p.colors[0])
    router.replace(`/designer?product=${p.id}`, { scroll: false })
  }

  const addLogo = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const id = Date.now().toString(36)
      setLayers(prev => [...prev, { id, src: e.target?.result as string, x: 50, y: 42, scale: 1, rotation: 0 }])
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

  const startAction = (type: 'move' | 'resize' | 'rotate', id: string, e: React.PointerEvent) => {
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
        x: Math.min(92, Math.max(8, a.layer.x + (dx / rect.width) * 100)),
        y: Math.min(92, Math.max(8, a.layer.y + (dy / rect.height) * 100)),
      })
    } else if (a.type === 'resize') {
      updateLayer(a.id, { scale: Math.min(3, Math.max(0.2, a.layer.scale + (dx + dy) / 2 / 100)) })
    } else if (a.type === 'rotate') {
      const cx = rect.left + (a.layer.x / 100) * rect.width
      const cy = rect.top + (a.layer.y / 100) * rect.height
      const delta = (Math.atan2(e.clientY - cy, e.clientX - cx) - Math.atan2(a.startY - cy, a.startX - cx)) * (180 / Math.PI)
      updateLayer(a.id, { rotation: Math.round(a.layer.rotation + delta) })
    }
  }

  const handleWhatsApp = () => {
    const logoInfo = layers.length > 0 ? `✅ Logo uploadé` : `❌ Pas de logo`
    const noteInfo = note.trim() ? `\n💬 Note : ${note.trim()}` : ''
    const remiseInfo = remise > 0 ? `\n🎁 Remise : -${remise * 100}%` : ''

    const msg = encodeURIComponent(
      `Bonjour Caractère Store 👋\n\n` +
      `Je veux passer une commande via le Designer :\n\n` +
      `👕 *Produit* : ${product.name}\n` +
      `🎨 *Couleur* : ${currentColor.name}\n` +
      `📦 *Quantité* : ${qty} pièce${qty > 1 ? 's' : ''}\n` +
      `${logoInfo}` +
      `${remiseInfo}` +
      `${noteInfo}\n\n` +
      `💰 *Total estimé* : ${total.toLocaleString('fr-FR')} DA (${unit.toLocaleString('fr-FR')} DA/pièce)\n\n` +
      `Merci !`
    )
    window.open(`https://wa.me/213557440522?text=${msg}`, '_blank')
  }

  const BASE_W = 110

  if (refCode) {
    return (
      <main className="pt-14 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center py-20 max-w-[500px] mx-auto px-6">
          <div className="text-[64px] mb-6">✅</div>
          <h2 className="text-[28px] font-bold tracking-tight mb-3">Commande envoyée !</h2>
          <div className="text-[22px] font-bold font-mono bg-brand-light rounded-2xl px-6 py-3 inline-block mb-4 tracking-widest">{refCode}</div>
          <p className="text-[14px] text-brand-gray mb-6">Notre équipe vous contacte sous 24h par WhatsApp.</p>
          <a href={`/suivi/${refCode}`} className="inline-block bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-medium no-underline">
            Voir le suivi →
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-14 min-h-screen bg-white" onPointerMove={onPointerMove} onPointerUp={() => { action.current = null }}>
      <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-8 md:py-10">

        <div className="mb-6">
          <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-1">Designer</span>
          <h1 className="text-[26px] md:text-[32px] font-bold tracking-tight text-brand-dark">Créez votre design.</h1>
          <p className="text-[13px] text-brand-gray mt-1">Choisissez un produit, une couleur, uploadez votre logo.</p>
        </div>

        {/* Product tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {PRODUCTS.map(p => (
            <button key={p.id} onClick={() => handleProductChange(p)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${
                product.id === p.id
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-white text-brand-dark border-black/15 hover:border-black/30'
              }`}>
              {p.emoji} {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8">

          {/* ── CANVAS ── */}
          <div>
            {/* Color picker */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-gray mb-2">
                Couleur — <span className="text-brand-dark normal-case font-semibold">{currentColor.name}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {availableColors.map(c => (
                  <button key={c.key} title={c.name}
                    onClick={() => setColorKey(c.key)}
                    className={`w-9 h-9 rounded-full transition-all border-2 ${
                      colorKey === c.key
                        ? 'border-brand-dark scale-110 shadow-md'
                        : 'border-black/15 hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: c.hex,
                      boxShadow: c.hex === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Stage — mockup statique */}
            <div ref={stageRef} onClick={() => setActiveId(null)}
              className="relative w-full aspect-square bg-[#f8f9fa] rounded-[24px] overflow-hidden select-none border border-black/[0.06]">

              {/* Mockup image statique */}
              <img
                src={mockupSrc}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain p-6 pointer-events-none"
              />

              {/* Logo layers */}
              {layers.map(layer => {
                const isActive = layer.id === activeId
                const w = BASE_W * layer.scale
                return (
                  <div key={layer.id} onClick={e => e.stopPropagation()}
                    onPointerDown={e => startAction('move', layer.id, e)}
                    className="absolute cursor-move touch-none"
                    style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: w, height: w, transform: `translate(-50%,-50%) rotate(${layer.rotation}deg)` }}>
                    <img src={layer.src} alt="logo" className="w-full h-full object-contain pointer-events-none drop-shadow-lg" draggable={false} />
                    {isActive && (
                      <>
                        <div className="absolute inset-0 border-2 border-brand-dark rounded pointer-events-none" />
                        <button onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); removeLayer(layer.id) }}
                          className="absolute -top-3 -left-3 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-md">×</button>
                        <button onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); duplicateLayer(layer.id) }}
                          className="absolute -top-3 -right-3 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[12px] shadow-md">⧉</button>
                        <div onPointerDown={e => startAction('rotate', layer.id, e)}
                          className="absolute -bottom-3 -left-3 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[13px] shadow-md cursor-grab">↻</div>
                        <div onPointerDown={e => startAction('resize', layer.id, e)}
                          className="absolute -bottom-3 -right-3 w-7 h-7 bg-brand-dark rounded-full flex items-center justify-center text-white text-[12px] shadow-md cursor-nwse-resize">⤡</div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Upload */}
            <button onClick={() => fileRef.current?.click()}
              className="mt-3 w-full border-2 border-dashed border-black/20 rounded-2xl p-5 text-center cursor-pointer hover:border-black/40 transition-colors bg-brand-light/50">
              <div className="text-[24px] mb-0.5">📁</div>
              <div className="text-[13px] font-medium">Ajouter un logo / design</div>
              <div className="text-[11px] text-brand-gray mt-0.5">PNG, SVG, JPG · fond transparent recommandé</div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) addLogo(f) }} />
            </button>

            <p className="text-[11px] text-brand-gray text-center mt-2">
              Glissez · <span className="font-medium">×</span> supprimer · <span className="font-medium">⧉</span> dupliquer · <span className="font-medium">↻</span> tourner · <span className="font-medium">⤡</span> redimensionner
            </p>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="flex flex-col gap-4">

            {/* Récap */}
            <div className="bg-brand-light rounded-2xl p-4 space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-gray">Récapitulatif</p>

              <div className="flex justify-between text-[13px]">
                <span className="text-brand-gray">Produit</span>
                <span className="font-medium">{product.emoji} {product.name}</span>
              </div>

              <div className="flex justify-between text-[13px]">
                <span className="text-brand-gray">Couleur</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full border border-black/15 flex-shrink-0"
                    style={{
                      backgroundColor: currentColor.hex,
                      boxShadow: currentColor.hex === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined,
                    }} />
                  <span className="font-medium">{currentColor.name}</span>
                </div>
              </div>

              <div className="flex justify-between text-[13px] items-center">
                <span className="text-brand-gray">Quantité</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-black/15 text-[16px] flex items-center justify-center hover:border-black/30 transition-colors">−</button>
                  <span className="font-bold w-8 text-center text-[15px]">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="w-7 h-7 rounded-full bg-white border border-black/15 text-[16px] flex items-center justify-center hover:border-black/30 transition-colors">+</button>
                </div>
              </div>

              {remise > 0 && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-green-600">Remise</span>
                  <span className="text-green-600 font-medium">−{remise * 100}%</span>
                </div>
              )}

              <div className="h-px bg-black/10" />

              <div className="flex justify-between">
                <span className="text-[15px] font-semibold">Total estimé</span>
                <span className="text-[17px] font-bold">{total.toLocaleString('fr-FR')} DA</span>
              </div>
              <p className="text-[11px] text-brand-gray">{unit.toLocaleString('fr-FR')} DA / pièce</p>
            </div>

            {/* Note / commentaire */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-brand-gray block mb-2">
                Précision / commentaire
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Ex : broderie au lieu de DTF, position dos, taille du logo 10cm, couleur fil vert..."
                rows={3}
                className="w-full border border-black/15 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-brand-dark resize-none leading-relaxed placeholder:text-gray-400"
              />
            </div>

            {/* CTA WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-2xl text-[15px] font-bold hover:bg-[#20BD5A] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Confirmer la commande sur WhatsApp
            </button>

            <p className="text-[11px] text-brand-gray text-center leading-relaxed">
              Un message pré-rempli s'ouvrira dans WhatsApp.<br/>Notre équipe vous répond sous 2h.
            </p>

            {/* Info */}
            <div className="bg-[#F0F7F0] rounded-xl px-4 py-3">
              <p className="text-[11px] font-bold text-[#166534] uppercase tracking-wide mb-1">Livraison & Paiement</p>
              <p className="text-[12px] text-[#1A3D2B] leading-relaxed">
                Paiement à la livraison · BaridiMob · CCP<br/>
                Livraison nationale 3–5 jours
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}

export default function DesignerPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="pt-14 min-h-screen bg-white flex items-center justify-center">
          <p className="text-brand-gray">Chargement...</p>
        </div>
      }>
        <DesignerInner />
      </Suspense>
    </>
  )
}
