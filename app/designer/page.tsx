'use client'
import { useState, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'

interface LogoLayer {
  id: string
  src: string
  name: string
  view: 'front' | 'back'
  x: number
  y: number
  scale: number
  rotation: number
}

const PRODUCTS = [
  {
    id: 'tshirt',
    label: 'T-shirt',
    emoji: '👕',
    colors: {
      Blanc: {
        hex: '#FFFFFF',
        front: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-tshirt-blanc.jpg',
        back: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-tshirt-blanc.jpg',
      },
      Noir: {
        hex: '#1d1d1f',
        front: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-tshirt-noir.jpg',
        back: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-tshirt-noir.jpg',
      },
    },
  },
  {
    id: 'polo',
    label: 'Polo',
    emoji: '🎽',
    colors: {
      Blanc: {
        hex: '#FFFFFF',
        front: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-polo-blanc.jpg',
        back: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-polo-blanc.jpg',
      },
      Noir: {
        hex: '#1d1d1f',
        front: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-polo-noir.jpg',
        back: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-polo-noir.jpg',
      },
    },
  },
  {
    id: 'gilet',
    label: 'Gilet',
    emoji: '🦺',
    colors: {
      Noir: {
        hex: '#1d1d1f',
        front: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-gilet.jpg',
        back: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-gilet.jpg',
      },
    },
  },
  {
    id: 'casquette',
    label: 'Casquette',
    emoji: '🧢',
    colors: {
      Noir: {
        hex: '#1d1d1f',
        front: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-casquette.jpg',
        back: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-casquette.jpg',
      },
    },
  },
  {
    id: 'totebag',
    label: 'Totebag',
    emoji: '👜',
    colors: {
      Naturel: {
        hex: '#e8dfc8',
        front: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-totebag.jpg',
        back: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-totebag.jpg',
      },
    },
  },
] as const

type ProductId = typeof PRODUCTS[number]['id']

const PRODUCT_NOM_MAP: Record<ProductId, string> = {
  tshirt: 'T-shirt',
  polo: 'Polo',
  gilet: 'Gilet de travail',
  casquette: 'Casquette',
  totebag: 'Totebag',
}

const PRINT_ZONE = { left: 32, top: 22, width: 36, height: 40 }

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function DesignerPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductId>('tshirt')
  const [selectedColor, setSelectedColor] = useState<string>('Blanc')
  const [view, setView] = useState<'front' | 'back'>('front')
  const [layers, setLayers] = useState<LogoLayer[]>([])
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  const currentProduct = PRODUCTS.find(p => p.id === selectedProduct)!
  const currentColors = currentProduct.colors as Record<string, { hex: string; front: string; back: string }>
  const activeColorKey = currentColors[selectedColor] ? selectedColor : Object.keys(currentColors)[0]
  const activeColor = currentColors[activeColorKey]
  const mockupImg = view === 'front' ? activeColor.front : activeColor.back

  const visibleLayers = layers.filter(l => l.view === view)
  const activeLayer = layers.find(l => l.id === activeLayerId) ?? null

  function handleSelectProduct(id: ProductId) {
    setSelectedProduct(id)
    const product = PRODUCTS.find(p => p.id === id)!
    setSelectedColor(Object.keys(product.colors)[0])
  }

  function updateLayer(id: string, patch: Partial<LogoLayer>) {
    setLayers(ls => ls.map(l => (l.id === id ? { ...l, ...patch } : l)))
  }

  function updateActiveLayer(patch: Partial<LogoLayer>) {
    if (activeLayerId) updateLayer(activeLayerId, patch)
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const newLayer: LogoLayer = {
        id: makeId(),
        src: e.target?.result as string,
        name: file.name,
        view,
        x: 50, y: 45, scale: 1, rotation: 0,
      }
      setLayers(ls => [...ls, newLayer])
      setActiveLayerId(newLayer.id)
    }
    reader.readAsDataURL(file)
  }

  function duplicateLayer(id: string) {
    setLayers(ls => {
      const source = ls.find(l => l.id === id)
      if (!source) return ls
      const copy: LogoLayer = {
        ...source,
        id: makeId(),
        x: Math.min(90, source.x + 8),
        y: Math.min(90, source.y + 8),
      }
      setActiveLayerId(copy.id)
      return [...ls, copy]
    })
  }

  function duplicateToOtherSide(id: string) {
    setLayers(ls => {
      const source = ls.find(l => l.id === id)
      if (!source) return ls
      const otherView = source.view === 'front' ? 'back' : 'front'
      const copy: LogoLayer = { ...source, id: makeId(), view: otherView }
      return [...ls, copy]
    })
  }

  function deleteLayer(id: string) {
    setLayers(ls => {
      const remaining = ls.filter(l => l.id !== id)
      if (activeLayerId === id) {
        const sameView = remaining.filter(l => l.view === view)
        setActiveLayerId(sameView.length ? sameView[sameView.length - 1].id : null)
      }
      return remaining
    })
  }

  const onPointerDown = (e: React.PointerEvent, layer: LogoLayer) => {
    setActiveLayerId(layer.id)
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, tx: layer.x, ty: layer.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !stageRef.current || !activeLayerId) return
    const rect = stageRef.current.getBoundingClientRect()
    const dxPct = ((e.clientX - dragStart.current.x) / rect.width) * 100
    const dyPct = ((e.clientY - dragStart.current.y) / rect.height) * 100
    updateActiveLayer({
      x: Math.min(95, Math.max(5, dragStart.current.tx + dxPct)),
      y: Math.min(95, Math.max(5, dragStart.current.ty + dyPct)),
    })
  }

  const onPointerUp = () => setDragging(false)

  function switchView(next: 'front' | 'back') {
    setView(next)
    const sameView = layers.filter(l => l.view === next)
    setActiveLayerId(sameView.length ? sameView[sameView.length - 1].id : null)
  }

  function goToConfigurateur() {
    try {
      sessionStorage.setItem('designer_layers', JSON.stringify(layers))
    } catch (e) {
      console.warn('Impossible de sauvegarder les logos en session:', e)
    }
    const params = new URLSearchParams({
      produit: PRODUCT_NOM_MAP[selectedProduct],
      couleur: activeColorKey,
    })
    window.location.href = `/configurateur?${params.toString()}`
  }

  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen bg-white">
        <div className="max-w-[1100px] mx-auto px-6 py-10">

          <div className="mb-6">
            <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-2">Designer</span>
            <h1 className="text-[28px] md:text-[34px] font-bold tracking-tight text-brand-dark">Créez votre design.</h1>
            <p className="text-[14px] text-brand-gray mt-1">Choisissez un produit, uploadez votre logo et positionnez-le sur le recto ou le verso.</p>
          </div>

          {/* PRODUCT SELECTOR */}
          <div className="mb-6">
            <p className="text-[12px] font-bold tracking-widest uppercase text-brand-gray mb-3">Choisir un produit</p>
            <div className="flex gap-3 flex-wrap">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProduct(p.id)}
                  className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border transition-all min-w-[84px]
                    ${selectedProduct === p.id
                      ? 'border-brand-dark bg-brand-dark text-white shadow-md'
                      : 'border-black/10 bg-white text-brand-dark hover:border-black/30'}`}
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="text-[12px] font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">

            {/* CANVAS COLUMN */}
            <div>
              {/* TOOLBAR */}
              <div className="bg-[#111] rounded-t-2xl px-2 py-2.5 flex items-center justify-around">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center gap-1 text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-[18px]">🖼️</span>
                  <span className="text-[10px] font-semibold tracking-wide">IMAGES</span>
                </button>
                <div className="w-px h-8 bg-white/15" />
                <button
                  disabled
                  title="Bientôt disponible"
                  className="flex flex-col items-center gap-1 text-white/40 px-3 py-1.5 rounded-lg cursor-not-allowed"
                >
                  <span className="text-[18px]">🅰️</span>
                  <span className="text-[10px] font-semibold tracking-wide">ADD TEXT</span>
                </button>
                <div className="w-px h-8 bg-white/15" />
                <button
                  disabled
                  title="Bientôt disponible"
                  className="flex flex-col items-center gap-1 text-white/40 px-3 py-1.5 rounded-lg cursor-not-allowed"
                >
                  <span className="text-[18px]">🎨</span>
                  <span className="text-[10px] font-semibold tracking-wide">DESIGNS</span>
                </button>
              </div>

              {/* STAGE */}
              <div
                ref={stageRef}
                className="relative w-full aspect-square bg-brand-light overflow-hidden select-none border-x border-b border-black/[0.06] rounded-b-2xl"
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              >
                <img src={mockupImg} alt={currentProduct.label} className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />

                <div
                  className="absolute border-2 border-dashed border-red-400/70 pointer-events-none"
                  style={{ left: `${PRINT_ZONE.left}%`, top: `${PRINT_ZONE.top}%`, width: `${PRINT_ZONE.width}%`, height: `${PRINT_ZONE.height}%` }}
                />

                {visibleLayers.length === 0 && (
                  <div
                    className="absolute flex flex-col items-center justify-center gap-2 cursor-pointer"
                    style={{ left: `${PRINT_ZONE.left}%`, top: `${PRINT_ZONE.top}%`, width: `${PRINT_ZONE.width}%`, height: `${PRINT_ZONE.height}%` }}
                    onClick={() => fileRef.current?.click()}
                  >
                    <span className="text-[36px] opacity-50">☁️</span>
                    <span className="text-[11px] font-medium text-brand-dark/50 bg-white/70 px-2 py-1 rounded">Ajouter image</span>
                  </div>
                )}

                {visibleLayers.map(layer => (
                  <div
                    key={layer.id}
                    onPointerDown={(e) => onPointerDown(e, layer)}
                    className="absolute cursor-move touch-none"
                    style={{
                      left: `${layer.x}%`, top: `${layer.y}%`,
                      transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale})`,
                      width: `${PRINT_ZONE.width}%`,
                      zIndex: layer.id === activeLayerId ? 10 : 1,
                    }}
                  >
                    <img src={layer.src} alt={layer.name} className="w-full h-auto pointer-events-none drop-shadow-md" draggable={false} />
                    {layer.id === activeLayerId && (
                      <div className={`absolute inset-0 border-2 rounded ${dragging ? 'border-brand-dark' : 'border-brand-dark/50 border-dashed'}`} />
                    )}
                  </div>
                ))}

                {/* FRONT/BACK NAV */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white rounded-full shadow-lg px-2 py-2">
                  <button
                    onClick={() => switchView('front')}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-brand-dark disabled:opacity-30"
                    disabled={view === 'front'}
                  >
                    ←
                  </button>
                  <div className="flex items-center gap-1 px-2 text-[12px] font-semibold text-brand-dark">
                    <span>📄</span>
                    <span>{view === 'front' ? '1' : '2'}/2</span>
                  </div>
                  <button
                    onClick={() => switchView('back')}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-brand-dark disabled:opacity-30"
                    disabled={view === 'back'}
                  >
                    →
                  </button>
                </div>
              </div>

              {/* View tabs */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => switchView('front')}
                  className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all
                    ${view === 'front' ? 'bg-brand-dark text-white' : 'bg-brand-light text-brand-gray hover:bg-black/5'}`}
                >
                  Avant / Front {layers.some(l => l.view === 'front') && '●'}
                </button>
                <button
                  onClick={() => switchView('back')}
                  className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all
                    ${view === 'back' ? 'bg-brand-dark text-white' : 'bg-brand-light text-brand-gray hover:bg-black/5'}`}
                >
                  Arrière / Back {layers.some(l => l.view === 'back') && '●'}
                </button>
              </div>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
            </div>

            {/* CONTROLS */}
            <div className="flex flex-col gap-7">

              {/* Color */}
              {Object.keys(currentColors).length > 1 && (
                <div>
                  <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray block mb-3">Couleur</label>
                  <div className="flex gap-3">
                    {Object.entries(currentColors).map(([name, c]) => (
                      <button
                        key={name}
                        onClick={() => setSelectedColor(name)}
                        title={name}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${activeColorKey === name ? 'border-brand-dark scale-110' : 'border-black/10'}`}
                        style={{ background: c.hex, boxShadow: c.hex === '#FFFFFF' ? 'inset 0 0 0 1px rgba(0,0,0,0.12)' : 'none' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Layers list (current view only) */}
              {visibleLayers.length > 0 && (
                <div>
                  <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray block mb-3">
                    Logos sur {view === 'front' ? 'avant' : 'arrière'} ({visibleLayers.length})
                  </label>
                  <div className="flex flex-col gap-2">
                    {visibleLayers.map(layer => (
                      <div
                        key={layer.id}
                        onClick={() => setActiveLayerId(layer.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all
                          ${layer.id === activeLayerId ? 'border-brand-dark bg-brand-light' : 'border-black/10 bg-white hover:border-black/25'}`}
                      >
                        <img src={layer.src} alt="" className="w-9 h-9 object-contain rounded-lg bg-white border border-black/5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-semibold truncate">{layer.name}</div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); duplicateLayer(layer.id) }}
                          title="Dupliquer"
                          className="text-[11px] font-medium text-brand-dark px-2 py-1 rounded-md hover:bg-black/5 flex-shrink-0"
                        >
                          ⧉
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id) }}
                          className="text-[11px] text-red-500 font-medium px-1.5 flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeLayer && activeLayer.view === view && (
                <>
                  {/* Scale */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray">Taille</label>
                      <span className="text-[12px] text-brand-gray font-medium">{Math.round(activeLayer.scale * 100)}%</span>
                    </div>
                    <input
                      type="range" min="0.3" max="2.2" step="0.05"
                      value={activeLayer.scale}
                      onChange={e => updateActiveLayer({ scale: parseFloat(e.target.value) })}
                      className="w-full accent-brand-dark"
                    />
                  </div>

                  {/* Rotation */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray">Rotation</label>
                      <span className="text-[12px] text-brand-gray font-medium">{activeLayer.rotation}°</span>
                    </div>
                    <input
                      type="range" min="-45" max="45" step="1"
                      value={activeLayer.rotation}
                      onChange={e => updateActiveLayer({ rotation: parseInt(e.target.value) })}
                      className="w-full accent-brand-dark"
                    />
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <button onClick={() => updateActiveLayer({ x: 50, y: 45, scale: 1, rotation: 0 })} className="text-[13px] font-medium text-brand-dark underline">
                      Réinitialiser
                    </button>
                    <button onClick={() => duplicateLayer(activeLayer.id)} className="text-[13px] font-medium text-brand-dark underline">
                      Dupliquer
                    </button>
                    <button onClick={() => duplicateToOtherSide(activeLayer.id)} className="text-[13px] font-medium text-brand-dark underline">
                      Copier vers {activeLayer.view === 'front' ? 'arrière' : 'avant'}
                    </button>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-black/[0.08]">
                <p className="text-[13px] text-brand-gray leading-relaxed mb-4">
                  Une fois satisfait de votre design, continuez vers le configurateur pour choisir la taille et finaliser votre commande.
                </p>
                <button
                  onClick={goToConfigurateur}
                  disabled={layers.length === 0}
                  className={`block w-full text-center bg-brand-dark text-white px-7 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors ${layers.length === 0 ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  Continuer vers la commande →
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  )
}
