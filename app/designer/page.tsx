'use client'
import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { MOCKUPS } from '@/components/designer/mockups-data'

/* ─── TYPES ─────────────────────────────────────────────────────────────── */
interface Layer {
  id: string
  type: 'image' | 'text'
  src?: string
  text?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: string
  color?: string
  x: number; y: number; scale: number; rotation: number
}

/* ─── DATA ───────────────────────────────────────────────────────────────── */
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
  { id: 'tshirt',           name: 'T-shirt',       prix: 1800, colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[] },
  { id: 'tshirt_oversized', name: 'Oversized 250G',prix: 3200, colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[] },
  { id: 'polo',             name: 'Polo',          prix: 2500, colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[] },
  { id: 'gilet',            name: 'Gilet travail', prix: 2500, colors: ['noir','rouge','beige','royal'] as ColorKey[] },
  { id: 'gilet_securite',   name: 'Gilet sécu.',   prix: 1500, colors: ['blanc'] as ColorKey[] },
  { id: 'casquette',        name: 'Casquette',     prix: 1500, colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[] },
  { id: 'totebag',          name: 'Totebag',       prix: 1200, colors: ['beige','noir'] as ColorKey[] },
  { id: 'hoodie',           name: 'Hoodie',        prix: 3800, colors: ['blanc','noir','marine','royal','rouge','vert','gris','beige','bordeaux'] as ColorKey[] },
  { id: 'tablier',          name: 'Tablier',       prix: 1500, colors: ['noir','rouge','bordeaux'] as ColorKey[] },
]

const FONTS = ['Inter', 'Georgia', 'Impact', 'Courier New', 'Arial Black', 'Trebuchet MS']
const TEXT_COLORS = ['#000000','#FFFFFF','#DC2626','#2563EB','#16A34A','#F59E0B','#7C3AED','#EC4899']

function calcPrice(prix: number, qty: number) {
  const remise = qty >= 100 ? 0.10 : qty >= 50 ? 0.05 : 0
  const unit = Math.round(prix * (1 - remise))
  return { unit, total: unit * qty, remise }
}

/* ─── INNER ──────────────────────────────────────────────────────────────── */
function DesignerInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialId = searchParams.get('product') || 'tshirt'
  const initialProduct = PRODUCTS.find(p => p.id === initialId) || PRODUCTS[0]

  const [product, setProduct] = useState(initialProduct)
  const [colorKey, setColorKey] = useState<ColorKey>(initialProduct.colors[0])
  const [layers, setLayers] = useState<Layer[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')
  const [tool, setTool] = useState<'select'|'text'>('select')
  const [showTextPanel, setShowTextPanel] = useState(false)
  const [newText, setNewText] = useState('')
  const [textFont, setTextFont] = useState('Inter')
  const [textSize, setTextSize] = useState(32)
  const [textWeight, setTextWeight] = useState('700')
  const [textColor, setTextColor] = useState('#000000')
  const [rightPanel, setRightPanel] = useState<'order'|'layers'>('order')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const action = useRef<{ type: 'move'|'resize'|'rotate'; id: string; startX: number; startY: number; layer: Layer } | null>(null)

  const currentColor = ALL_COLORS[colorKey]
  const availableColors = product.colors.map(k => ({ key: k, ...ALL_COLORS[k] }))
  const { unit, total, remise } = calcPrice(product.prix, qty)
  const activeLayer = layers.find(l => l.id === activeId) || null

  const handleProductChange = (p: typeof PRODUCTS[0]) => {
    setProduct(p)
    setLayers([])
    setActiveId(null)
    if (!p.colors.includes(colorKey)) setColorKey(p.colors[0])
    router.replace(`/designer?product=${p.id}`, { scroll: false })
  }

  /* ── Add image ── */
  const addImage = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      const id = Date.now().toString(36)
      setLayers(prev => [...prev, { id, type: 'image', src: e.target?.result as string, x: 50, y: 45, scale: 1, rotation: 0 }])
      setActiveId(id)
      setTool('select')
    }
    reader.readAsDataURL(file)
  }

  /* ── Add text ── */
  const addText = () => {
    if (!newText.trim()) return
    const id = Date.now().toString(36)
    setLayers(prev => [...prev, {
      id, type: 'text', text: newText,
      fontFamily: textFont, fontSize: textSize, fontWeight: textWeight, color: textColor,
      x: 50, y: 40, scale: 1, rotation: 0,
    }])
    setActiveId(id)
    setNewText('')
    setShowTextPanel(false)
    setTool('select')
  }

  const updateLayer = (id: string, patch: Partial<Layer>) =>
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))

  const removeLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const moveLayerUp = (id: string) => {
    setLayers(prev => {
      const i = prev.findIndex(l => l.id === id)
      if (i >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[i], next[i+1]] = [next[i+1], next[i]]
      return next
    })
  }

  const moveLayerDown = (id: string) => {
    setLayers(prev => {
      const i = prev.findIndex(l => l.id === id)
      if (i <= 0) return prev
      const next = [...prev]
      ;[next[i], next[i-1]] = [next[i-1], next[i]]
      return next
    })
  }

  /* ── Pointer interactions ── */
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
      updateLayer(a.id, { scale: Math.min(4, Math.max(0.15, a.layer.scale + (dx + dy) / 2 / 80)) })
    } else if (a.type === 'rotate') {
      const cx = rect.left + (a.layer.x / 100) * rect.width
      const cy = rect.top + (a.layer.y / 100) * rect.height
      const delta = (Math.atan2(e.clientY - cy, e.clientX - cx) - Math.atan2(a.startY - cy, a.startX - cx)) * (180 / Math.PI)
      updateLayer(a.id, { rotation: Math.round(a.layer.rotation + delta) })
    }
  }

  /* ── WhatsApp ── */
  const handleOrder = () => {
    const msg = encodeURIComponent(
      `Bonjour Caractère Store 👋\n\n` +
      `🛒 Commande via Designer :\n\n` +
      `👕 *Produit* : ${product.name}\n` +
      `🎨 *Couleur* : ${currentColor.name}\n` +
      `📦 *Quantité* : ${qty} pièce${qty > 1 ? 's' : ''}\n` +
      `🎨 *Éléments* : ${layers.length} (${layers.filter(l=>l.type==='image').length} logo, ${layers.filter(l=>l.type==='text').length} texte)\n` +
      (note ? `💬 *Note* : ${note}\n` : '') +
      `\n💰 *Total* : ${total.toLocaleString('fr-FR')} DA (${unit.toLocaleString('fr-FR')} DA/pièce)\n\nMerci !`
    )
    window.open(`https://wa.me/213557440522?text=${msg}`, '_blank')
  }

  const BASE_W = 120
  const mockupSrc = MOCKUPS[product.id] || MOCKUPS['tshirt']

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (activeId && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          removeLayer(activeId)
        }
      }
      if (e.key === 'Escape') setActiveId(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeId])

  return (
    <div className="flex flex-col h-screen bg-[#F1F1F1] overflow-hidden" onPointerMove={onPointerMove} onPointerUp={() => { action.current = null }}>

      {/* ── TOP BAR ── */}
      <div className="flex-shrink-0 bg-white border-b border-black/10 shadow-sm z-20">
        <Navbar />
        <div className="flex items-center gap-2 px-3 py-2 border-t border-black/[0.06] overflow-x-auto">

          {/* Products */}
          <div className="flex gap-1.5 mr-2 pr-2 border-r border-black/10">
            {PRODUCTS.map(p => (
              <button key={p.id} onClick={() => handleProductChange(p)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all ${
                  product.id === p.id ? 'bg-[#0C4A6E] text-white' : 'hover:bg-black/5 text-gray-600'
                }`}>
                {p.name}
              </button>
            ))}
          </div>

          {/* Tools */}
          <div className="flex gap-1 bg-black/[0.04] rounded-xl p-1 flex-shrink-0">
            {/* Upload */}
            <button onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white shadow-sm text-[12px] font-semibold text-gray-700 hover:shadow-md transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Image
            </button>
            {/* Text */}
            <button onClick={() => { setShowTextPanel(!showTextPanel); setTool('text') }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                showTextPanel ? 'bg-[#0C4A6E] text-white shadow-md' : 'bg-white shadow-sm text-gray-700 hover:shadow-md'
              }`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
              Texte
            </button>
          </div>

          {/* Active layer quick controls */}
          {activeLayer && (
            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-black/10 flex-shrink-0">
              <button onClick={() => removeLayer(activeLayer.id)}
                className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-[11px] font-bold hover:bg-red-100 transition-colors">
                Supprimer
              </button>
              <button onClick={() => updateLayer(activeLayer.id, { rotation: 0, scale: 1, x: 50, y: 45 })}
                className="px-2.5 py-1.5 rounded-lg bg-black/5 text-gray-600 text-[11px] font-bold hover:bg-black/10 transition-colors">
                Centrer
              </button>
              {activeLayer.type === 'text' && (
                <select value={activeLayer.fontFamily} onChange={e => updateLayer(activeLayer.id, { fontFamily: e.target.value })}
                  className="border border-black/10 rounded-lg px-2 py-1 text-[11px] outline-none">
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              )}
            </div>
          )}

          {/* Mobile sidebar toggle */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto lg:hidden px-3 py-2 rounded-xl bg-[#0C4A6E] text-white text-[12px] font-bold flex-shrink-0">
            {sidebarOpen ? '← Design' : 'Commande →'}
          </button>
        </div>

        {/* Text panel */}
        {showTextPanel && (
          <div className="px-4 py-3 border-t border-black/[0.06] bg-[#FAFAFA] flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500 block mb-1">Texte</label>
              <input value={newText} onChange={e => setNewText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addText()}
                placeholder="Votre texte ici..."
                className="w-full border border-black/15 rounded-xl px-3 py-2 text-[14px] outline-none focus:border-[#0C4A6E]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500 block mb-1">Police</label>
              <select value={textFont} onChange={e => setTextFont(e.target.value)}
                className="border border-black/15 rounded-xl px-3 py-2 text-[13px] outline-none">
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500 block mb-1">Taille</label>
              <input type="number" value={textSize} onChange={e => setTextSize(Number(e.target.value))} min={10} max={200}
                className="w-16 border border-black/15 rounded-xl px-3 py-2 text-[13px] outline-none text-center" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500 block mb-1">Couleur</label>
              <div className="flex gap-1.5">
                {TEXT_COLORS.map(c => (
                  <button key={c} onClick={() => setTextColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${textColor === c ? 'border-[#0C4A6E] scale-110' : 'border-black/15'}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setTextWeight(textWeight === '700' ? '400' : '700')}
                className={`px-3 py-2 rounded-xl text-[13px] font-bold border transition-all ${textWeight === '700' ? 'bg-[#0C4A6E] text-white border-[#0C4A6E]' : 'bg-white border-black/15 text-gray-700'}`}>
                B
              </button>
              <button onClick={addText}
                className="px-4 py-2 rounded-xl bg-[#0C4A6E] text-white text-[13px] font-bold hover:bg-[#1E6FA8] transition-colors">
                Ajouter →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── CANVAS ── */}
        <div className={`flex-1 flex items-center justify-center p-4 relative ${sidebarOpen ? 'hidden lg:flex' : 'flex'}`}>

          {/* Color strip */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
            {availableColors.map(c => (
              <button key={c.key} onClick={() => setColorKey(c.key)} title={c.name}
                className={`w-7 h-7 rounded-full border-2 transition-all shadow-sm ${colorKey === c.key ? 'border-[#0C4A6E] scale-110 shadow-md' : 'border-white hover:scale-105'}`}
                style={{ background: c.hex, boxShadow: c.hex === '#FFFFFF' ? '0 0 0 1px #ddd, 0 1px 3px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.2)' }} />
            ))}
          </div>

          {/* Canvas stage */}
          <div
            ref={stageRef}
            onClick={() => setActiveId(null)}
            className="relative rounded-[20px] overflow-hidden shadow-2xl"
            style={{
              width: 'min(calc(100vw - 80px), calc(100vh - 200px), 560px)',
              height: 'min(calc(100vw - 80px), calc(100vh - 200px), 560px)',
              background: '#F9F9F7',
              cursor: tool === 'text' ? 'text' : 'default',
            }}
          >
            {/* Mockup plein cadre */}
            <img src={mockupSrc} alt={product.name}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ padding: '12px' }} />

            {/* Layers */}
            {layers.map(layer => {
              const isActive = layer.id === activeId
              const w = layer.type === 'text'
                ? undefined
                : BASE_W * layer.scale

              return (
                <div key={layer.id}
                  onClick={e => { e.stopPropagation(); setActiveId(layer.id) }}
                  onPointerDown={e => startAction('move', layer.id, e)}
                  className="absolute cursor-move touch-none select-none"
                  style={{
                    left: `${layer.x}%`, top: `${layer.y}%`,
                    width: layer.type === 'image' ? w : undefined,
                    height: layer.type === 'image' ? w : undefined,
                    transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.type === 'text' ? layer.scale : 1})`,
                  }}>

                  {layer.type === 'image' ? (
                    <img src={layer.src} alt="design"
                      className="w-full h-full object-contain pointer-events-none drop-shadow-lg"
                      draggable={false} />
                  ) : (
                    <p style={{
                      fontFamily: layer.fontFamily,
                      fontSize: `${layer.fontSize}px`,
                      fontWeight: layer.fontWeight,
                      color: layer.color,
                      whiteSpace: 'nowrap',
                      lineHeight: 1.1,
                      textShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      userSelect: 'none',
                    }}>{layer.text}</p>
                  )}

                  {isActive && (
                    <>
                      <div className="absolute inset-[-4px] border-2 border-[#0C4A6E] rounded pointer-events-none" style={{ boxShadow: '0 0 0 1px rgba(12,74,110,0.2)' }} />
                      {/* Delete */}
                      <button onPointerDown={e => e.stopPropagation()}
                        onClick={e => { e.stopPropagation(); removeLayer(layer.id) }}
                        className="absolute -top-4 -left-4 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-lg transition-colors">×</button>
                      {/* Duplicate */}
                      <button onPointerDown={e => e.stopPropagation()}
                        onClick={e => { e.stopPropagation(); const id2 = Date.now().toString(36); setLayers(p => [...p, { ...layer, id: id2, x: Math.min(90, layer.x+4), y: Math.min(90, layer.y+4) }]); setActiveId(id2) }}
                        className="absolute -top-4 -right-4 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[11px] shadow-lg hover:bg-gray-50">⧉</button>
                      {/* Rotate */}
                      <div onPointerDown={e => startAction('rotate', layer.id, e)}
                        className="absolute -bottom-4 -left-4 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[14px] shadow-lg cursor-grab">↻</div>
                      {/* Resize */}
                      <div onPointerDown={e => startAction('resize', layer.id, e)}
                        className="absolute -bottom-4 -right-4 w-7 h-7 bg-[#0C4A6E] rounded-full flex items-center justify-center text-white text-[11px] shadow-lg cursor-nwse-resize">⤡</div>
                    </>
                  )}
                </div>
              )
            })}

            {/* Empty state hint */}
            {layers.length === 0 && (
              <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
                <div className="text-center">
                  <p className="text-[12px] text-gray-400 font-medium">↑ Uploadez un logo ou ajoutez du texte</p>
                </div>
              </div>
            )}
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 hidden md:block">
            Delete = supprimer · Escape = désélectionner
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className={`w-full lg:w-[300px] flex-shrink-0 bg-white border-l border-black/10 flex flex-col overflow-hidden ${sidebarOpen ? 'flex' : 'hidden lg:flex'}`}>

          {/* Panel tabs */}
          <div className="flex border-b border-black/10 flex-shrink-0">
            {(['order', 'layers'] as const).map(t => (
              <button key={t} onClick={() => setRightPanel(t)}
                className={`flex-1 py-3 text-[12px] font-bold transition-colors ${rightPanel === t ? 'border-b-2 border-[#0C4A6E] text-[#0C4A6E]' : 'text-gray-400 hover:text-gray-600'}`}>
                {t === 'order' ? '🛒 Commande' : `📐 Calques (${layers.length})`}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">

            {/* ── ORDER PANEL ── */}
            {rightPanel === 'order' && (
              <div className="p-4 space-y-4">

                {/* Produit sélectionné */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Produit</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {PRODUCTS.map(p => (
                      <button key={p.id} onClick={() => handleProductChange(p)}
                        className={`py-2 px-1 rounded-xl text-[10px] font-semibold text-center transition-all border ${
                          product.id === p.id ? 'bg-[#0C4A6E] text-white border-[#0C4A6E]' : 'bg-white text-gray-600 border-black/10 hover:border-black/25'
                        }`}>
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Couleur */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Couleur — <span className="text-[#0C4A6E] normal-case">{currentColor.name}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(c => (
                      <button key={c.key} onClick={() => setColorKey(c.key)} title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${colorKey === c.key ? 'border-[#0C4A6E] scale-110 shadow-md' : 'border-black/10 hover:scale-105'}`}
                        style={{ background: c.hex, boxShadow: c.hex === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined }} />
                    ))}
                  </div>
                </div>

                {/* Quantité */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Quantité</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-xl border border-black/10 text-[18px] font-bold flex items-center justify-center hover:bg-gray-50">−</button>
                    <span className="text-[20px] font-bold text-center flex-1">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)}
                      className="w-9 h-9 rounded-xl border border-black/10 text-[18px] font-bold flex items-center justify-center hover:bg-gray-50">+</button>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[{r:'1–49',p:'',a:qty<50},{r:'50+',p:'-5%',a:qty>=50&&qty<100},{r:'100+',p:'-10%',a:qty>=100}].map(t => (
                      <div key={t.r} className={`flex-1 text-center py-1 rounded-lg text-[10px] font-bold border ${t.a ? 'border-green-300 bg-green-50 text-green-700' : 'border-black/08 text-gray-400'}`}>
                        {t.r} {t.p}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prix */}
                <div className="bg-[#F0F7FF] rounded-2xl p-4">
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-gray-500">{product.name} × {qty}</span>
                    <span className="font-bold text-[#0C4A6E]">{total.toLocaleString('fr-FR')} DA</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Prix unitaire</span>
                    <span className="text-gray-600">{unit.toLocaleString('fr-FR')} DA/pièce</span>
                  </div>
                  {remise > 0 && (
                    <div className="flex justify-between text-[11px] mt-1">
                      <span className="text-green-600">Remise volume</span>
                      <span className="text-green-600 font-bold">-{remise*100}%</span>
                    </div>
                  )}
                </div>

                {/* Note */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Note / Précisions</p>
                  <textarea value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Broderie, position, couleur fil, taille logo..."
                    rows={3}
                    className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-[#0C4A6E] resize-none placeholder:text-gray-300" />
                </div>

                {/* CTA */}
                <button onClick={handleOrder}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white py-4 rounded-2xl text-[15px] font-bold transition-all shadow-lg hover:-translate-y-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Commander sur WhatsApp
                </button>

                <div className="flex gap-3 text-[11px] text-gray-400 justify-center">
                  <span>💳 Paiement livraison</span>
                  <span>·</span>
                  <span>🚚 National 3–5j</span>
                  <span>·</span>
                  <span>🎨 Vecto offerte</span>
                </div>
              </div>
            )}

            {/* ── LAYERS PANEL ── */}
            {rightPanel === 'layers' && (
              <div className="p-4">
                {layers.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-[32px] mb-2">📐</p>
                    <p className="text-[13px]">Aucun élément</p>
                    <p className="text-[11px] mt-1">Uploadez une image ou ajoutez du texte</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...layers].reverse().map((layer, i) => (
                      <div key={layer.id} onClick={() => setActiveId(layer.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          activeId === layer.id ? 'border-[#0C4A6E] bg-[#EFF6FF]' : 'border-black/08 hover:border-black/20 bg-white'
                        }`}>
                        {/* Preview */}
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {layer.type === 'image' ? (
                            <img src={layer.src} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-[18px]">T</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-gray-800 truncate">
                            {layer.type === 'text' ? `"${layer.text}"` : 'Image'}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {layer.type === 'text' ? `${layer.fontFamily} · ${layer.fontSize}px` : `${Math.round(layer.scale * 100)}% · ${layer.rotation}°`}
                          </p>
                        </div>
                        {/* Order buttons */}
                        <div className="flex flex-col gap-0.5">
                          <button onClick={e => { e.stopPropagation(); moveLayerUp(layer.id) }}
                            className="w-5 h-5 rounded flex items-center justify-center text-[10px] hover:bg-black/10">▲</button>
                          <button onClick={e => { e.stopPropagation(); moveLayerDown(layer.id) }}
                            className="w-5 h-5 rounded flex items-center justify-center text-[10px] hover:bg-black/10">▼</button>
                        </div>
                        <button onClick={e => { e.stopPropagation(); removeLayer(layer.id) }}
                          className="w-6 h-6 rounded-lg bg-red-50 text-red-500 text-[12px] flex items-center justify-center hover:bg-red-100 flex-shrink-0">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) addImage(f) }} />
    </div>
  )
}

export default function DesignerPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0C4A6E]/20 border-t-[#0C4A6E] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px] text-gray-500">Chargement du Designer…</p>
        </div>
      </div>
    }>
      <DesignerInner />
    </Suspense>
  )
}
