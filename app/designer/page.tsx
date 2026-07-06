'use client'
import { useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { MOCKUPS } from '@/components/designer/mockups-data'

interface LogoLayer {
  id: string; src: string; x: number; y: number; scale: number; rotation: number
}

const ALL_COLORS = {
  blanc:    { name: 'Blanc',    hex: '#FFFFFF' },
  noir:     { name: 'Noir',     hex: '#1A1A1A' },
  marine:   { name: 'Marine',   hex: '#1E3A5F' },
  royal:    { name: 'Bleu roi', hex: '#2563EB' },
  rouge:    { name: 'Rouge',    hex: '#DC2626' },
  vert:     { name: 'Vert',     hex: '#166534' },
  gris:     { name: 'Gris',     hex: '#6B7280' },
  beige:    { name: 'Beige',    hex: '#D6B99A' },
  bordeaux: { name: 'Bordeaux', hex: '#7F1D1D' },
} as const
type ColorKey = keyof typeof ALL_COLORS

const PRODUCTS = [
  { id: 'tshirt',           name: 'T-shirt',       emoji: '👕', prix_base: 1800, colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[] },
  { id: 'tshirt_oversized', name: 'Oversized',     emoji: '👕', prix_base: 3200, colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[] },
  { id: 'polo',             name: 'Polo',          emoji: '👔', prix_base: 2200, colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[] },
  { id: 'gilet',            name: 'Gilet',         emoji: '🦺', prix_base: 2500, colors: ['noir','rouge','beige','royal'] as ColorKey[] },
  { id: 'gilet_securite',   name: 'Gilet sécu.',   emoji: '🟡', prix_base: 1500, colors: ['blanc'] as ColorKey[] },
  { id: 'casquette',        name: 'Casquette',     emoji: '🧢', prix_base: 1500, colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[] },
  { id: 'totebag',          name: 'Totebag',       emoji: '👜', prix_base: 1200, colors: ['beige','noir'] as ColorKey[] },
  { id: 'hoodie',           name: 'Hoodie',        emoji: '🧥', prix_base: 3800, colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[] },
  { id: 'tablier',          name: 'Tablier',       emoji: '🍽️', prix_base: 1500, colors: ['noir','rouge','bordeaux'] as ColorKey[] },
]

function getMockup(productId: string): string {
  return MOCKUPS[productId] || MOCKUPS['tshirt']
}

function calcPrice(prixBase: number, qty: number) {
  const remise = qty >= 100 ? 0.10 : qty >= 50 ? 0.05 : 0
  const unit = Math.round(prixBase * (1 - remise))
  return { unit, total: unit * qty, remise }
}

// ─── Icones ──────────────────────────────────────────────────────────────────
const IconUpload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
)
const IconWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

// ─── Designer principal ───────────────────────────────────────────────────────
function DesignerInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialId = searchParams.get('product') || 'tshirt'
  const initialProduct = PRODUCTS.find(p => p.id === initialId) || PRODUCTS[0]

  const [product, setProduct]     = useState(initialProduct)
  const [colorKey, setColorKey]   = useState<ColorKey>(initialProduct.colors[0])
  const [layers, setLayers]       = useState<LogoLayer[]>([])
  const [activeId, setActiveId]   = useState<string | null>(null)
  const [qty, setQty]             = useState(1)
  const [note, setNote]           = useState('')
  const [showHelp, setShowHelp]   = useState(false)

  const fileRef  = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const action   = useRef<{ type: 'move'|'resize'|'rotate'; id: string; startX: number; startY: number; layer: LogoLayer } | null>(null)

  const { unit, total, remise } = calcPrice(product.prix_base, qty)
  const currentColor    = ALL_COLORS[colorKey]
  const availableColors = product.colors.map(k => ({ key: k, ...ALL_COLORS[k] }))
  const mockupSrc       = getMockup(product.id)
  const activeLayer     = layers.find(l => l.id === activeId)

  const handleProductChange = (p: typeof PRODUCTS[0]) => {
    setProduct(p)
    setLayers([])
    setActiveId(null)
    if (!p.colors.includes(colorKey)) setColorKey(p.colors[0])
    router.replace(`/designer?product=${p.id}`, { scroll: false })
  }

  const addLogo = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      const id = Date.now().toString(36)
      setLayers(prev => [...prev, { id, src: e.target?.result as string, x: 50, y: 42, scale: 1, rotation: 0 }])
      setActiveId(id)
      setShowHelp(false)
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
    const logoInfo  = layers.length > 0 ? '✅ Logo uploadé' : '❌ Pas de logo'
    const noteInfo  = note.trim() ? `\n💬 Note : ${note.trim()}` : ''
    const remiseInfo = remise > 0 ? `\n🎁 Remise : −${remise * 100}%` : ''
    const msg = encodeURIComponent(
      `Bonjour Caractère Store 👋\n\nCommande via Designer :\n\n` +
      `👕 *Produit* : ${product.name}\n` +
      `🎨 *Couleur* : ${currentColor.name}\n` +
      `📦 *Quantité* : ${qty} pièce${qty > 1 ? 's' : ''}\n` +
      `${logoInfo}${remiseInfo}${noteInfo}\n\n` +
      `💰 *Total estimé* : ${total.toLocaleString('fr-FR')} DA (${unit.toLocaleString('fr-FR')} DA/pièce)\n\nMerci !`
    )
    window.open(`https://wa.me/213557440522?text=${msg}`, '_blank')
  }

  const BASE_W = 110

  return (
    <main
      className="pt-14 min-h-screen bg-white"
      onPointerMove={onPointerMove}
      onPointerUp={() => { action.current = null }}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-[11px] font-bold tracking-widest uppercase text-brand-gray mb-1">Designer</p>
          <h1 className="text-[28px] md:text-[36px] font-bold tracking-tight text-brand-dark leading-tight">
            Créez votre design.
          </h1>
          <p className="text-[14px] text-brand-gray mt-1.5">
            Choisissez un produit · une couleur · uploadez votre logo.
          </p>
        </div>

        {/* ── Sélecteur produit ── */}
        <div className="mb-8 overflow-x-auto pb-1">
          <div className="flex gap-2 min-w-max">
            {PRODUCTS.map(p => (
              <button
                key={p.id}
                onClick={() => handleProductChange(p)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium border-2 transition-all whitespace-nowrap
                  ${product.id === p.id
                    ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                    : 'bg-white text-brand-dark border-black/12 hover:border-black/30'
                  }`}
              >
                <span>{p.emoji}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Layout 2 colonnes ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* ── Canvas zone ── */}
          <div>

            {/* Couleurs */}
            <div className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-gray mb-3">
                Couleur — <span className="text-brand-dark normal-case font-semibold">{currentColor.name}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {availableColors.map(c => (
                  <button
                    key={c.key}
                    title={c.name}
                    onClick={() => setColorKey(c.key)}
                    className={`w-9 h-9 rounded-full transition-all border-2 ${colorKey === c.key ? 'border-brand-dark scale-110 shadow-md' : 'border-black/15 hover:scale-105'}`}
                    style={{ backgroundColor: c.hex, boxShadow: c.hex === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined }}
                  />
                ))}
              </div>
            </div>

            {/* Canvas */}
            <div
              ref={stageRef}
              onClick={() => setActiveId(null)}
              className="relative w-full aspect-square bg-[#F4F4F2] rounded-[28px] overflow-hidden select-none border border-black/[0.05] shadow-inner"
              style={{ cursor: layers.length > 0 ? 'default' : 'crosshair' }}
            >
              {/* Mockup */}
              <img
                src={mockupSrc}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain p-8 pointer-events-none"
              />

              {/* État vide */}
              {layers.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 text-center shadow-sm border border-black/[0.06]">
                    <p className="text-[13px] font-medium text-brand-dark mb-0.5">Uploadez votre logo</p>
                    <p className="text-[11px] text-brand-gray">Il apparaîtra ici en temps réel</p>
                  </div>
                </div>
              )}

              {/* Layers */}
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
                      transform: `translate(-50%,-50%) rotate(${layer.rotation}deg)`,
                    }}
                  >
                    <img
                      src={layer.src} alt="logo"
                      className="w-full h-full object-contain pointer-events-none drop-shadow-lg"
                      draggable={false}
                    />
                    {isActive && (
                      <>
                        {/* Bordure sélection */}
                        <div className="absolute inset-0 border-2 border-brand-dark rounded pointer-events-none" />
                        {/* Supprimer */}
                        <button
                          onPointerDown={e => e.stopPropagation()}
                          onClick={e => { e.stopPropagation(); removeLayer(layer.id) }}
                          className="absolute -top-3.5 -left-3.5 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
                        >
                          <IconTrash />
                        </button>
                        {/* Dupliquer */}
                        <button
                          onPointerDown={e => e.stopPropagation()}
                          onClick={e => { e.stopPropagation(); duplicateLayer(layer.id) }}
                          className="absolute -top-3.5 -right-3.5 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[12px] shadow-md hover:bg-brand-light transition-colors"
                        >⧉</button>
                        {/* Rotation */}
                        <div
                          onPointerDown={e => startAction('rotate', layer.id, e)}
                          className="absolute -bottom-3.5 -left-3.5 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[14px] shadow-md cursor-grab"
                        >↻</div>
                        {/* Resize */}
                        <div
                          onPointerDown={e => startAction('resize', layer.id, e)}
                          className="absolute -bottom-3.5 -right-3.5 w-7 h-7 bg-brand-dark rounded-full flex items-center justify-center text-white text-[12px] shadow-md cursor-nwse-resize"
                        >⤡</div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Contrôles sous canvas */}
            <div className="mt-4 flex items-center gap-3">
              {/* Bouton upload principal */}
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2.5 border-2 border-dashed border-black/20 hover:border-brand-dark hover:bg-brand-light/40 rounded-2xl py-4 transition-all group"
              >
                <span className="text-brand-gray group-hover:text-brand-dark transition-colors"><IconUpload /></span>
                <div className="text-left">
                  <p className="text-[13px] font-semibold text-brand-dark leading-tight">Ajouter un logo / design</p>
                  <p className="text-[11px] text-brand-gray">PNG · SVG · JPG — fond transparent recommandé</p>
                </div>
              </button>

              {/* Aide */}
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center text-[14px] text-brand-gray hover:bg-brand-light transition-colors flex-shrink-0"
                title="Comment utiliser"
              >?</button>
            </div>

            {/* Panneau d'aide */}
            {showHelp && (
              <div className="mt-3 bg-brand-light rounded-2xl p-4 grid grid-cols-2 gap-2">
                {[
                  { icon: '✋', label: 'Déplacer', sub: 'Clic + glisser' },
                  { icon: '⤡', label: 'Redimensionner', sub: 'Coin bas-droite' },
                  { icon: '↻', label: 'Tourner', sub: 'Coin bas-gauche' },
                  { icon: '⧉', label: 'Dupliquer', sub: 'Coin haut-droite' },
                ].map(h => (
                  <div key={h.label} className="flex items-center gap-2.5 bg-white rounded-xl p-2.5">
                    <span className="text-[18px]">{h.icon}</span>
                    <div>
                      <p className="text-[12px] font-semibold text-brand-dark">{h.label}</p>
                      <p className="text-[11px] text-brand-gray">{h.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) addLogo(f) }}
            />

            {/* Info layer actif */}
            {activeLayer && (
              <div className="mt-3 flex items-center gap-3 bg-brand-light rounded-xl px-4 py-2.5">
                <p className="text-[12px] text-brand-gray flex-1">
                  Rotation <strong className="text-brand-dark">{activeLayer.rotation}°</strong>
                  {' · '}
                  Taille <strong className="text-brand-dark">{Math.round(activeLayer.scale * 100)}%</strong>
                </p>
                <button
                  onClick={() => updateLayer(activeLayer.id, { rotation: 0, scale: 1, x: 50, y: 42 })}
                  className="text-[11px] text-brand-gray underline"
                >
                  Réinitialiser
                </button>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-4">

            {/* Récap prix */}
            <div className="bg-brand-light rounded-2xl p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-gray mb-4">Votre commande</p>

              {/* Produit */}
              <div className="flex justify-between text-[13px] py-2 border-b border-black/[0.06]">
                <span className="text-brand-gray">Produit</span>
                <span className="font-semibold">{product.emoji} {product.name}</span>
              </div>

              {/* Couleur */}
              <div className="flex justify-between items-center text-[13px] py-2 border-b border-black/[0.06]">
                <span className="text-brand-gray">Couleur</span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-black/15 flex-shrink-0"
                    style={{ backgroundColor: currentColor.hex, boxShadow: currentColor.hex === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined }}
                  />
                  <span className="font-semibold">{currentColor.name}</span>
                </div>
              </div>

              {/* Quantité */}
              <div className="flex justify-between items-center text-[13px] py-2.5 border-b border-black/[0.06]">
                <span className="text-brand-gray">Quantité</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-black/15 text-[16px] flex items-center justify-center hover:bg-black/5 transition-colors"
                  >−</button>
                  <span className="font-bold w-8 text-center text-[15px]">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-7 h-7 rounded-full bg-white border border-black/15 text-[16px] flex items-center justify-center hover:bg-black/5 transition-colors"
                  >+</button>
                </div>
              </div>

              {/* Remise */}
              {remise > 0 && (
                <div className="flex justify-between text-[13px] py-2 border-b border-black/[0.06]">
                  <span className="text-green-600 font-medium">Remise volume</span>
                  <span className="text-green-600 font-bold">−{remise * 100}%</span>
                </div>
              )}

              {/* Logo */}
              <div className="flex justify-between text-[13px] py-2 border-b border-black/[0.06]">
                <span className="text-brand-gray">Logo</span>
                <span className={layers.length > 0 ? 'text-green-600 font-medium' : 'text-brand-gray/60'}>
                  {layers.length > 0 ? `✓ ${layers.length} élément${layers.length > 1 ? 's' : ''}` : 'Non uploadé'}
                </span>
              </div>

              {/* Total */}
              <div className="pt-3 mt-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] text-brand-gray">Total estimé</span>
                  <span className="text-[22px] font-bold text-brand-dark tracking-tight">{total.toLocaleString('fr-FR')} DA</span>
                </div>
                <p className="text-[11px] text-brand-gray text-right">{unit.toLocaleString('fr-FR')} DA / pièce</p>
              </div>

              {/* Paliers */}
              <div className="mt-3 flex gap-1.5">
                {[
                  { range: '1–49', pct: '', active: qty < 50 },
                  { range: '50+', pct: '−5%', active: qty >= 50 && qty < 100 },
                  { range: '100+', pct: '−10%', active: qty >= 100 },
                ].map(t => (
                  <div key={t.range} className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-medium border transition-all
                    ${t.active ? 'border-green-300 bg-green-50 text-green-700' : 'border-black/10 text-brand-gray/60'}`}>
                    {t.range} {t.pct && <span className="font-bold">{t.pct}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Note / commentaire */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-brand-gray block mb-2">
                Précisions
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Ex : broderie au lieu de DTF, position dos, taille logo 10 cm, couleur fil…"
                rows={3}
                className="w-full border-2 border-black/12 focus:border-brand-dark rounded-xl px-4 py-3 text-[13px] outline-none resize-none leading-relaxed placeholder:text-gray-400 transition-colors"
              />
            </div>

            {/* CTA WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white py-4 rounded-2xl text-[15px] font-bold transition-all shadow-lg shadow-green-200/50 hover:-translate-y-0.5"
            >
              <IconWhatsApp />
              Confirmer sur WhatsApp
            </button>

            <p className="text-[11px] text-brand-gray text-center leading-relaxed -mt-1">
              Un message pré-rempli s'ouvre dans WhatsApp.<br />Notre équipe répond sous 2h.
            </p>

            {/* Infos livraison */}
            <div className="rounded-2xl border border-black/[0.07] p-4 space-y-3">
              {[
                { icon: '💳', text: 'Paiement à la livraison · BaridiMob · CCP' },
                { icon: '🚚', text: 'Livraison nationale 3–5 jours' },
                { icon: '🎨', text: 'Vectorisation logo offerte' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <span className="text-[16px]">{item.icon}</span>
                  <p className="text-[12px] text-brand-gray">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Lien configurateur */}
            <a
              href={`/configurateur?produit=${product.name}&couleur=${currentColor.name}`}
              className="block text-center text-[12px] text-brand-dark font-semibold underline underline-offset-2 hover:text-brand-gray transition-colors"
            >
              Aller au configurateur complet →
            </a>

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
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[13px] text-brand-gray">Chargement du Designer…</p>
          </div>
        </div>
      }>
        <DesignerInner />
      </Suspense>
    </>
  )
}