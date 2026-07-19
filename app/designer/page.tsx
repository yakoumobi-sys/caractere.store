'use client'
import { useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { MOCKUPS } from '@/components/designer/mockups-data'
import { TSHIRT_VIEWS } from '@/components/designer/tshirt-views'

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

const FONTS = ['Inter','Impact','Georgia','Arial Black','Courier New','Trebuchet MS']
const TEXT_COLORS = ['#000000','#FFFFFF','#DC2626','#2563EB','#16A34A','#F59E0B','#7C3AED']

function calcPrice(prix: number, qty: number) {
  const remise = qty >= 100 ? 0.10 : qty >= 50 ? 0.05 : 0
  const unit = Math.round(prix * (1 - remise))
  return { unit, total: unit * qty, remise }
}

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
  const [showText, setShowText] = useState(false)
  const [newText, setNewText] = useState('')
  const [textFont, setTextFont] = useState('Inter')
  const [textSize, setTextSize] = useState(32)
  const [textBold, setTextBold] = useState(true)
  const [textColor, setTextColor] = useState('#000000')

  const fileRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const action = useRef<{
    type: 'move'|'resize'|'rotate'
    id: string; startX: number; startY: number; layer: Layer
  } | null>(null)

  const currentColor = ALL_COLORS[colorKey]
  const availableColors = product.colors.map(k => ({ key: k, ...ALL_COLORS[k] }))
  const { unit, total, remise } = calcPrice(product.prix, qty)
  const [viewIndex, setViewIndex] = useState(0)
  const views = product.id === 'tshirt' ? TSHIRT_VIEWS : [MOCKUPS[product.id] || MOCKUPS['tshirt']]
  const mockupSrc = views[viewIndex] || views[0]

  // Reset view when product changes
  const handleProductWithReset = (p: typeof PRODUCTS[0]) => {
    setViewIndex(0)
    handleProduct(p)
  }

  const handleProduct = (p: typeof PRODUCTS[0]) => {
    setProduct(p)
    setLayers([])
    setActiveId(null)
    if (!p.colors.includes(colorKey)) setColorKey(p.colors[0])
    router.replace(`/designer?product=${p.id}`, { scroll: false })
  }

  const addImage = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      const id = Date.now().toString(36)
      setLayers(prev => [...prev, { id, type:'image', src: e.target?.result as string, x:50, y:45, scale:1, rotation:0 }])
      setActiveId(id)
    }
    reader.readAsDataURL(file)
  }

  const addText = () => {
    if (!newText.trim()) return
    const id = Date.now().toString(36)
    setLayers(prev => [...prev, {
      id, type:'text', text:newText, fontFamily:textFont, fontSize:textSize,
      fontWeight: textBold ? '700' : '400', color:textColor, x:50, y:40, scale:1, rotation:0
    }])
    setActiveId(id)
    setNewText('')
    setShowText(false)
  }

  const updateLayer = (id: string, patch: Partial<Layer>) =>
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))

  const removeLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id))
    if (activeId === id) setActiveId(null)
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
      updateLayer(a.id, { scale: Math.min(4, Math.max(0.15, a.layer.scale + (dx + dy) / 2 / 80)) })
    } else if (a.type === 'rotate') {
      const cx = rect.left + (a.layer.x / 100) * rect.width
      const cy = rect.top + (a.layer.y / 100) * rect.height
      const delta = (Math.atan2(e.clientY - cy, e.clientX - cx) - Math.atan2(a.startY - cy, a.startX - cx)) * (180 / Math.PI)
      updateLayer(a.id, { rotation: Math.round(a.layer.rotation + delta) })
    }
  }

  const handleOrder = () => {
    const msg = encodeURIComponent(
      `Bonjour Caractère Store 👋\n\nCommande Designer :\n\n` +
      `👕 *Produit* : ${product.name}\n` +
      `🎨 *Couleur* : ${currentColor.name}\n` +
      `📦 *Quantité* : ${qty} pièce${qty > 1 ? 's' : ''}\n` +
      `🎨 *Éléments* : ${layers.length} (${layers.filter(l=>l.type==='image').length} image, ${layers.filter(l=>l.type==='text').length} texte)\n` +
      (note ? `💬 *Note* : ${note}\n` : '') +
      `💰 *Total* : ${total.toLocaleString('fr-FR')} DA\n\nMerci !`
    )
    window.open(`https://wa.me/213557440522?text=${msg}`, '_blank')
  }

  const BASE_W = 110
  const activeLayer = layers.find(l => l.id === activeId)

  return (
    <main className="min-h-screen bg-[#F4F4F2]" onPointerMove={onPointerMove} onPointerUp={() => { action.current = null }}>
      <Navbar />
      <div className="pt-14 max-w-[1100px] mx-auto px-3 pb-10">

        {/* ── CANVAS ── */}
        <div className="relative pt-4">

          {/* Canvas */}
          <div ref={stageRef} onClick={() => setActiveId(null)}
            className="relative w-full bg-white rounded-[24px] shadow-lg overflow-hidden mx-auto"
            style={{ aspectRatio: '1', maxWidth: '560px' }}>

            <img src={mockupSrc} alt={product.name}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none p-3" />

            {/* Navigation recto/verso */}
            {views.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); setViewIndex(i => (i - 1 + views.length) % views.length) }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md border border-black/10 z-10 transition-all hover:scale-105"
                  style={{ color: '#0C4A6E' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setViewIndex(i => (i + 1) % views.length) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md border border-black/10 z-10 transition-all hover:scale-105"
                  style={{ color: '#0C4A6E' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                {/* Dots indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {views.map((_, i) => (
                    <button key={i} onClick={e => { e.stopPropagation(); setViewIndex(i) }}
                      className={`w-2 h-2 rounded-full transition-all ${viewIndex === i ? 'bg-[#0C4A6E] w-4' : 'bg-black/20'}`} />
                  ))}
                </div>
                {/* Label */}
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-bold text-[#0C4A6E] z-10">
                  {viewIndex === 0 ? 'RECTO' : viewIndex === 1 ? 'VERSO' : 'CÔTÉ'}
                </div>
              </>
            )}

            {layers.map(layer => {
              const isActive = layer.id === activeId
              const w = BASE_W * layer.scale
              return (
                <div key={layer.id}
                  onClick={e => { e.stopPropagation(); setActiveId(layer.id) }}
                  onPointerDown={e => startAction('move', layer.id, e)}
                  className="absolute cursor-move touch-none select-none"
                  style={{
                    left: `${layer.x}%`, top: `${layer.y}%`,
                    width: layer.type === 'image' ? w : undefined,
                    height: layer.type === 'image' ? w : undefined,
                    transform: `translate(-50%,-50%) rotate(${layer.rotation}deg) scale(${layer.type === 'text' ? layer.scale : 1})`,
                  }}>
                  {layer.type === 'image' ? (
                    <img src={layer.src} alt="design" className="w-full h-full object-contain pointer-events-none drop-shadow-lg" draggable={false} />
                  ) : (
                    <p style={{ fontFamily: layer.fontFamily, fontSize: `${layer.fontSize}px`, fontWeight: layer.fontWeight, color: layer.color, whiteSpace: 'nowrap', lineHeight: 1.1, userSelect: 'none' }}>
                      {layer.text}
                    </p>
                  )}
                  {isActive && (
                    <>
                      <div className="absolute inset-[-4px] border-2 border-[#0C4A6E] rounded pointer-events-none" />
                      <button onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();removeLayer(layer.id)}}
                        className="absolute -top-4 -left-4 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-md">×</button>
                      <button onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();const id2=Date.now().toString(36);setLayers(p=>[...p,{...layer,id:id2,x:Math.min(90,layer.x+4),y:Math.min(90,layer.y+4)}]);setActiveId(id2)}}
                        className="absolute -top-4 -right-4 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[11px] shadow-md">⧉</button>
                      <div onPointerDown={e=>startAction('rotate',layer.id,e)}
                        className="absolute -bottom-4 -left-4 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[13px] shadow-md cursor-grab">↻</div>
                      <div onPointerDown={e=>startAction('resize',layer.id,e)}
                        className="absolute -bottom-4 -right-4 w-7 h-7 bg-[#0C4A6E] rounded-full flex items-center justify-center text-white text-[11px] shadow-md cursor-nwse-resize">⤡</div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* ── BOUTONS UPLOAD + TEXTE sous le canvas ── */}
          <div className="flex gap-3 mt-4 max-w-[560px] mx-auto">
            <button onClick={() => fileRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0C4A6E] text-white py-3.5 rounded-2xl text-[15px] font-bold shadow-md hover:bg-[#1E6FA8] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Ajouter un logo
            </button>
            <button onClick={() => setShowText(!showText)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[15px] font-bold shadow-md transition-colors ${
                showText ? 'bg-[#1E6FA8] text-white' : 'bg-white text-[#0C4A6E] border-2 border-[#0C4A6E]'
              }`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
              Ajouter du texte
            </button>
          </div>

          {/* ── PANNEAU TEXTE ── */}
          {showText && (
            <div className="mt-3 max-w-[560px] mx-auto bg-white rounded-2xl p-4 shadow-md space-y-3 border border-black/[0.07]">
              <input value={newText} onChange={e => setNewText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addText()}
                placeholder="Votre texte..."
                className="w-full border-2 border-black/10 focus:border-[#0C4A6E] rounded-xl px-4 py-3 text-[15px] outline-none"
                autoFocus />
              <div className="flex gap-2 flex-wrap">
                <select value={textFont} onChange={e => setTextFont(e.target.value)}
                  className="flex-1 border border-black/10 rounded-xl px-3 py-2 text-[13px] outline-none min-w-[130px]">
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <input type="number" value={textSize} onChange={e => setTextSize(Number(e.target.value))} min={10} max={150}
                  className="w-16 border border-black/10 rounded-xl px-3 py-2 text-[13px] outline-none text-center" />
                <button onClick={() => setTextBold(!textBold)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-black border transition-all ${textBold ? 'bg-[#0C4A6E] text-white border-[#0C4A6E]' : 'bg-white border-black/10 text-gray-600'}`}>B</button>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">Couleur</span>
                {TEXT_COLORS.map(c => (
                  <button key={c} onClick={() => setTextColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${textColor === c ? 'border-[#0C4A6E] scale-110' : 'border-black/10'}`}
                    style={{ background: c, boxShadow: c === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined }} />
                ))}
              </div>
              <button onClick={addText} disabled={!newText.trim()}
                className="w-full py-3 bg-[#0C4A6E] text-white rounded-xl text-[14px] font-bold disabled:opacity-40 hover:bg-[#1E6FA8] transition-colors">
                Ajouter sur le produit →
              </button>
            </div>
          )}

          {/* Info layer actif */}
          {activeLayer && (
            <div className="mt-3 max-w-[560px] mx-auto flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 shadow-sm border border-black/[0.07]">
              <p className="text-[12px] text-gray-500 flex-1">
                Rotation <strong className="text-gray-800">{activeLayer.rotation}°</strong>
                {' · '}Taille <strong className="text-gray-800">{Math.round(activeLayer.scale * 100)}%</strong>
              </p>
              <button onClick={() => updateLayer(activeLayer.id, { rotation:0, scale:1, x:50, y:45 })}
                className="text-[11px] text-[#0C4A6E] font-semibold underline">Centrer</button>
              <button onClick={() => removeLayer(activeLayer.id)}
                className="text-[11px] text-red-500 font-semibold">Supprimer</button>
            </div>
          )}
        </div>

        {/* ── PANNEAU BAS ── */}
        <div className="mt-6 bg-white rounded-[24px] shadow-md overflow-hidden border border-black/[0.06]">

          {/* Produit */}
          <div className="p-4 border-b border-black/[0.06]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Produit</p>
            <div className="grid grid-cols-3 gap-2">
              {PRODUCTS.map(p => (
                <button key={p.id} onClick={() => handleProductWithReset(p)}
                  className={`py-2.5 px-2 rounded-xl text-[12px] font-semibold text-center transition-all border-2 ${
                    product.id === p.id ? 'bg-[#0C4A6E] text-white border-[#0C4A6E]' : 'bg-white text-gray-600 border-black/10 hover:border-black/25'
                  }`}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Couleur */}
          <div className="p-4 border-b border-black/[0.06]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              Couleur — <span className="text-[#0C4A6E] normal-case font-semibold">{currentColor.name}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {availableColors.map(c => (
                <button key={c.key} onClick={() => setColorKey(c.key)} title={c.name}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${colorKey === c.key ? 'border-[#0C4A6E] scale-110 shadow-md' : 'border-black/10 hover:scale-105'}`}
                  style={{ background: c.hex, boxShadow: c.hex === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined }} />
              ))}
            </div>
          </div>

          {/* Quantité */}
          <div className="p-4 border-b border-black/[0.06]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Quantité</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setQty(q => Math.max(1, q-1))}
                className="w-11 h-11 rounded-xl border-2 border-black/10 text-[20px] font-bold flex items-center justify-center hover:bg-gray-50">−</button>
              <span className="text-[24px] font-black text-gray-800 flex-1 text-center">{qty}</span>
              <button onClick={() => setQty(q => q+1)}
                className="w-11 h-11 rounded-xl border-2 border-black/10 text-[20px] font-bold flex items-center justify-center hover:bg-gray-50">+</button>
            </div>
            <div className="flex gap-1.5 mt-3">
              {[{r:'1–49',p:'',a:qty<50},{r:'50+',p:'-5%',a:qty>=50&&qty<100},{r:'100+',p:'-10%',a:qty>=100}].map(t => (
                <div key={t.r} className={`flex-1 text-center py-1.5 rounded-lg text-[11px] font-bold border ${t.a ? 'border-green-300 bg-green-50 text-green-700' : 'border-black/08 text-gray-400'}`}>
                  {t.r} {t.p && <span className="font-black">{t.p}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Prix */}
          <div className="px-4 py-3 bg-[#F0F7FF] border-b border-black/[0.06]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[13px] text-gray-500">{product.name} × {qty}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{unit.toLocaleString('fr-FR')} DA / pièce{remise > 0 ? ` · -${remise*100}% remise` : ''}</p>
              </div>
              <p className="text-[24px] font-black text-[#0C4A6E]">{total.toLocaleString('fr-FR')} <span className="text-[16px]">DA</span></p>
            </div>
          </div>

          {/* Note */}
          <div className="p-4 border-b border-black/[0.06]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Précisions (optionnel)</p>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="Ex : broderie au lieu de DTF, position dos, taille logo 10cm..."
              rows={2} className="w-full border border-black/10 focus:border-[#0C4A6E] rounded-xl px-3 py-2.5 text-[13px] outline-none resize-none placeholder:text-gray-300" />
          </div>

          {/* CTA */}
          <div className="p-4">
            <button onClick={handleOrder}
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white py-4 rounded-2xl text-[16px] font-bold transition-all shadow-lg hover:-translate-y-0.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Confirmer sur WhatsApp
            </button>
            <p className="text-[11px] text-gray-400 text-center mt-2">Message pré-rempli · Réponse sous 2h</p>
            <div className="flex justify-center gap-4 mt-2 text-[11px] text-gray-400">
              <span>💳 Paiement livraison</span>
              <span>🚚 National 3–5j</span>
              <span>🎨 Vecto offerte</span>
            </div>
          </div>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) addImage(f) }} />
    </main>
  )
}

export default function DesignerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F4F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0C4A6E]/20 border-t-[#0C4A6E] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px] text-gray-500">Chargement…</p>
        </div>
      </div>
    }>
      <DesignerInner />
    </Suspense>
  )
}
