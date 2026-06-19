'use client'
import { useState, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

interface LogoTransform {
  x: number      // percentage from left of print zone
  y: number      // percentage from top of print zone
  scale: number  // 0.3 to 2.5
  rotation: number // degrees
}

const PRODUCTS = [
  {
    id: 'tshirt',
    label: 'T-shirt',
    emoji: '👕',
    colors: {
      Blanc: { hex: '#FFFFFF', img: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-tshirt-blanc.jpg' },
      Noir: { hex: '#1d1d1f', img: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-tshirt-noir.jpg' },
    },
  },
  {
    id: 'polo',
    label: 'Polo',
    emoji: '🎽',
    colors: {
      Blanc: { hex: '#FFFFFF', img: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-polo-blanc.jpg' },
      Noir: { hex: '#1d1d1f', img: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-polo-noir.jpg' },
    },
  },
  {
    id: 'gilet',
    label: 'Gilet',
    emoji: '🦺',
    colors: {
      Noir: { hex: '#1d1d1f', img: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-gilet.jpg' },
    },
  },
  {
    id: 'casquette',
    label: 'Casquette',
    emoji: '🧢',
    colors: {
      Noir: { hex: '#1d1d1f', img: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-casquette.jpg' },
    },
  },
  {
    id: 'totebag',
    label: 'Totebag',
    emoji: '👜',
    colors: {
      Naturel: { hex: '#e8dfc8', img: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/mockup-totebag.jpg' },
    },
  },
] as const

type ProductId = typeof PRODUCTS[number]['id']

// Print zone defined as percentage of the t-shirt image bounding box
// Tuned for a centered-chest area on a standard front-facing tshirt photo
const PRINT_ZONE = { left: 32, top: 22, width: 36, height: 40 }

export default function DesignerPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductId>('tshirt')
  const [selectedColor, setSelectedColor] = useState<string>('Blanc')
  const [logoSrc, setLogoSrc] = useState<string | null>(null)
  const [logoName, setLogoName] = useState('')
  const [transform, setTransform] = useState<LogoTransform>({ x: 50, y: 45, scale: 1, rotation: 0 })
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  const currentProduct = PRODUCTS.find(p => p.id === selectedProduct)!
  const currentColors = currentProduct.colors as Record<string, { hex: string; img: string }>
  const activeColorKey = currentColors[selectedColor] ? selectedColor : Object.keys(currentColors)[0]
  const activeColor = currentColors[activeColorKey]
  const mockupImg = activeColor.img

  function handleSelectProduct(id: ProductId) {
    setSelectedProduct(id)
    const product = PRODUCTS.find(p => p.id === id)!
    const firstColor = Object.keys(product.colors)[0]
    setSelectedColor(firstColor)
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setLogoSrc(e.target?.result as string)
      setLogoName(file.name)
      setTransform({ x: 50, y: 45, scale: 1, rotation: 0 })
    }
    reader.readAsDataURL(file)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!logoSrc) return
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const dxPct = ((e.clientX - dragStart.current.x) / rect.width) * 100
    const dyPct = ((e.clientY - dragStart.current.y) / rect.height) * 100
    setTransform(t => ({
      ...t,
      x: Math.min(95, Math.max(5, dragStart.current.tx + dxPct)),
      y: Math.min(95, Math.max(5, dragStart.current.ty + dyPct)),
    }))
  }

  const onPointerUp = () => setDragging(false)

  const reset = () => setTransform({ x: 50, y: 45, scale: 1, rotation: 0 })

  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen bg-white">
        <div className="max-w-[1100px] mx-auto px-6 py-10">

          <div className="mb-8">
            <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-2">Designer</span>
            <h1 className="text-[28px] md:text-[34px] font-bold tracking-tight text-brand-dark">Créez votre design.</h1>
            <p className="text-[14px] text-brand-gray mt-1">Choisissez un produit, uploadez votre logo et positionnez-le.</p>
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

            {/* CANVAS */}
            <div>
              <div
                ref={stageRef}
                className="relative w-full aspect-square bg-brand-light rounded-[24px] overflow-hidden select-none border border-black/[0.06]"
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              >
                <img src={mockupImg} alt={currentProduct.label} className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />

                {/* Print zone guide (visible only while no logo, subtle) */}
                {!logoSrc && (
                  <div
                    className="absolute border-2 border-dashed border-black/25 rounded-lg flex items-center justify-center"
                    style={{
                      left: `${PRINT_ZONE.left}%`, top: `${PRINT_ZONE.top}%`,
                      width: `${PRINT_ZONE.width}%`, height: `${PRINT_ZONE.height}%`,
                    }}
                  >
                    <span className="text-[11px] font-medium text-brand-dark/50 bg-white/70 px-2 py-1 rounded">Zone d'impression</span>
                  </div>
                )}

                {logoSrc && (
                  <div
                    onPointerDown={onPointerDown}
                    className="absolute cursor-move touch-none"
                    style={{
                      left: `${transform.x}%`,
                      top: `${transform.y}%`,
                      transform: `translate(-50%, -50%) rotate(${transform.rotation}deg) scale(${transform.scale})`,
                      width: `${PRINT_ZONE.width}%`,
                    }}
                  >
                    <img src={logoSrc} alt="Votre logo" className="w-full h-auto pointer-events-none drop-shadow-md" draggable={false} />
                    {dragging && <div className="absolute inset-0 border-2 border-brand-dark rounded" />}
                  </div>
                )}
              </div>

              {!logoSrc && (
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                  className="mt-4 border-2 border-dashed border-black/20 rounded-2xl p-8 text-center cursor-pointer hover:border-black/40 transition-colors bg-brand-light/50"
                >
                  <div className="text-[32px] mb-2">📁</div>
                  <div className="text-[14px] font-medium">Glissez votre logo ici ou cliquez pour parcourir</div>
                  <div className="text-[11px] text-brand-gray mt-1">PNG, JPG — fond transparent recommandé</div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                </div>
              )}
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

              {logoSrc && (
                <>
                  <div className="bg-brand-light rounded-2xl p-4 flex items-center gap-3">
                    <img src={logoSrc} alt="" className="w-12 h-12 object-contain rounded-lg bg-white" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate">{logoName}</div>
                      <div className="text-[11px] text-brand-gray">Glissez sur le produit pour repositionner</div>
                    </div>
                    <button onClick={() => { setLogoSrc(null); setLogoName('') }} className="text-[12px] text-red-500 font-medium flex-shrink-0">Suppr.</button>
                  </div>

                  {/* Scale */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray">Taille</label>
                      <span className="text-[12px] text-brand-gray font-medium">{Math.round(transform.scale * 100)}%</span>
                    </div>
                    <input
                      type="range" min="0.3" max="2.2" step="0.05"
                      value={transform.scale}
                      onChange={e => setTransform(t => ({ ...t, scale: parseFloat(e.target.value) }))}
                      className="w-full accent-brand-dark"
                    />
                  </div>

                  {/* Rotation */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[12px] font-bold tracking-widest uppercase text-brand-gray">Rotation</label>
                      <span className="text-[12px] text-brand-gray font-medium">{transform.rotation}°</span>
                    </div>
                    <input
                      type="range" min="-45" max="45" step="1"
                      value={transform.rotation}
                      onChange={e => setTransform(t => ({ ...t, rotation: parseInt(e.target.value) }))}
                      className="w-full accent-brand-dark"
                    />
                  </div>

                  <button onClick={reset} className="text-[13px] font-medium text-brand-dark underline self-start">
                    Réinitialiser la position
                  </button>
                </>
              )}

              <div className="pt-4 border-t border-black/[0.08]">
                <p className="text-[13px] text-brand-gray leading-relaxed mb-4">
                  Une fois satisfait de votre design, continuez vers le configurateur pour choisir la quantité et finaliser votre commande.
                </p>
                <Link
                  href="/configurateur"
                  className={`block text-center bg-brand-dark text-white px-7 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors no-underline ${!logoSrc ? 'opacity-40 pointer-events-none' : ''}`}
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