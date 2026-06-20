'use client'
import { useState, useRef, useCallback } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

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
  { id: 'tshirt',    name: 'T-shirt',  img: BASE + '/mockup-tshirt.jpg' },
  { id: 'polo',      name: 'Polo',     img: BASE + '/mockup-polo.jpg' },
  { id: 'gilet',     name: 'Gilet',    img: BASE + '/mockup-gilet.jpg' },
  { id: 'casquette', name: 'Casquette',img: BASE + '/mockup-casquette.jpg' },
  { id: 'totebag',   name: 'Totebag',  img: BASE + '/mockup-totebag.jpg' },
]

const PRINT_ZONE = { left: 28, top: 20, width: 44, height: 40 }
const BASE_W = 120 // px reference width for a layer at scale=1

export default function DesignerPage() {
  const [product, setProduct] = useState(PRODUCTS[0])
  const [layers, setLayers] = useState<LogoLayer[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const action = useRef<{ type: 'move'|'resize'|'rotate'|null, id: string, startX: number, startY: number, layer: LogoLayer } | null>(null)

  const active = layers.find(l => l.id === activeId) || null

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

  const updateLayer = (id: string, patch: Partial<LogoLayer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))
  }
  const removeLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id))
    if (activeId === id) setActiveId(null)
  }
  const duplicateLayer = (id: string) => {
    const l = layers.find(x => x.id === id)
    if (!l) return
    const newId = Date.now().toString(36)
    const copy = { ...l, id: newId, x: Math.min(90, l.x + 5), y: Math.min(90, l.y + 5) }
    setLayers(prev => [...prev, copy])
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
      const dxPct = (dx / rect.width) * 100
      const dyPct = (dy / rect.height) * 100
      updateLayer(a.id, {
        x: Math.min(95, Math.max(5, a.layer.x + dxPct)),
        y: Math.min(95, Math.max(5, a.layer.y + dyPct)),
      })
    } else if (a.type === 'resize') {
      const delta = (dx + dy) / 2
      const newScale = Math.min(3, Math.max(0.2, a.layer.scale + delta / 100))
      updateLayer(a.id, { scale: newScale })
    } else if (a.type === 'rotate') {
      const cx = rect.left + (a.layer.x / 100) * rect.width
      const cy = rect.top + (a.layer.y / 100) * rect.height
      const startAngle = Math.atan2(a.startY - cy, a.startX - cx)
      const curAngle = Math.atan2(e.clientY - cy, e.clientX - cx)
      const deltaDeg = (curAngle - startAngle) * (180 / Math.PI)
      updateLayer(a.id, { rotation: Math.round(a.layer.rotation + deltaDeg) })
    }
  }

  const onPointerUp = () => { action.current = null }

  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen bg-white" onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
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
                      style={{
                        left: `${layer.x}%`, top: `${layer.y}%`,
                        width: w, height: w,
                        transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                      }}
                    >
                      <img src={layer.src} alt="logo" className="w-full h-full object-contain pointer-events-none drop-shadow-md" draggable={false} />

                      {isActive && (
                        <>
                          <div className="absolute inset-0 border-2 border-brand-dark rounded pointer-events-none" />

                          {/* Top-left: delete */}
                          <button
                            onPointerDown={e => e.stopPropagation()}
                            onClick={e => { e.stopPropagation(); removeLayer(layer.id) }}
                            className="absolute -top-3 -left-3 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-md hover:bg-red-600"
                          >×</button>

                          {/* Top-right: duplicate */}
                          <button
                            onPointerDown={e => e.stopPropagation()}
                            onClick={e => { e.stopPropagation(); duplicateLayer(layer.id) }}
                            className="absolute -top-3 -right-3 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[12px] shadow-md hover:bg-brand-light"
                            title="Dupliquer"
                          >⧉</button>

                          {/* Bottom-left: rotate */}
                          <div
                            onPointerDown={e => startAction('rotate', layer.id, e)}
                            className="absolute -bottom-3 -left-3 w-7 h-7 bg-white border border-black/20 rounded-full flex items-center justify-center text-[13px] shadow-md cursor-grab active:cursor-grabbing"
                            title="Rotation"
                          >↻</div>

                          {/* Bottom-right: resize */}
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
              <div>
                <p className="text-[13px] text-brand-gray leading-relaxed">
                  Cliquez sur votre logo pour le sélectionner. Glissez pour déplacer. Utilisez les poignées aux coins pour supprimer, dupliquer, tourner ou redimensionner.
                </p>
              </div>

              <div className="pt-4 border-t border-black/[0.08]">
                <Link
                  href="/configurateur"
                  className={`block text-center bg-brand-dark text-white px-7 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors no-underline ${layers.length === 0 ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  Continuer vers la commande →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
