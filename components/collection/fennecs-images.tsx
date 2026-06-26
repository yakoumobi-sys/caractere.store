'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { FENNECS_IMAGES } from '@/components/collection/fennecs-images'

/* ─── TYPES ─────────────────────────────────────────────────────────────── */
type ColorKey = 'blanc' | 'noir' | 'vert'
type Taille   = 'S' | 'M' | 'L' | 'XL' | 'XXL'

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const COLORS: { key: ColorKey; label: string; hex: string }[] = [
  { key: 'blanc', label: 'Blanc',        hex: '#F5F5F0' },
  { key: 'noir',  label: 'Noir',         hex: '#1A1A1A' },
  { key: 'vert',  label: 'Vert bouteille', hex: '#1A3D2B' },
]

const TAILLES: Taille[] = ['S', 'M', 'L', 'XL', 'XXL']

const PRODUCT = {
  nom:         'Les Fennecs',
  subtitle:    'Édition Spéciale · World Cup 2026',
  prix:        2990,
  gsm:         '250GSM',
  qualite:     'ULTRA PREMIUM',
  matiere:     '100% Coton',
  coupe:       'Oversized',
  stock:       'Stock limité',
  description: 'T-shirt oversized ultra premium 250GSM. Édition limitée World Cup 2026. Impression DTF haute résolution. Design exclusif Les Fennecs.',
  details: [
    { icon: '🏆', label: 'Édition limitée World Cup 2026' },
    { icon: '👕', label: 'Coupe Oversized — taille normale' },
    { icon: '🧵', label: '250GSM · 100% Coton premium' },
    { icon: '🖨️', label: 'Impression DTF haute résolution' },
    { icon: '🚚', label: 'Livraison nationale Algérie' },
    { icon: '📦', label: 'Stock limité — commandez vite' },
  ],
}

/* ─── PAGE ──────────────────────────────────────────────────────────────── */
export default function CollectionPage() {
  const [color, setColor]   = useState<ColorKey>('blanc')
  const [taille, setTaille] = useState<Taille | null>(null)
  const [qty, setQty]       = useState(1)

  const colorLabel  = COLORS.find(c => c.key === color)?.label || ''
  const canOrder    = taille !== null
  const totalPrice  = (PRODUCT.prix * qty).toLocaleString('fr-FR')

  const buildWhatsApp = () => {
    const msg = encodeURIComponent(
      `Bonjour Caractère Store 👋\n\nJe veux commander :\n\n` +
      `🛒 *${PRODUCT.nom}* — Édition World Cup 2026\n` +
      `🎨 Couleur : ${colorLabel}\n` +
      `📐 Taille : ${taille}\n` +
      `📦 Quantité : ${qty}\n` +
      `💰 Total : ${totalPrice} DA\n\n` +
      `Merci !`
    )
    window.open(`https://wa.me/213557440522?text=${msg}`, '_blank')
  }

  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen bg-white">

        {/* ── HEADER ── */}
        <div className="bg-[#0C1A0E] text-white text-center py-2.5">
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#7AB87A]">
            ✦ Édition Limitée · World Cup 2026 · Stock Limité ✦
          </p>
        </div>

        <div className="max-w-[1080px] mx-auto px-4 md:px-6 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-8">
            <a href="/" className="hover:text-gray-700 transition-colors no-underline text-gray-400">Accueil</a>
            <span>›</span>
            <span className="text-gray-700 font-medium">Collection</span>
            <span>›</span>
            <span className="text-gray-500">Les Fennecs</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* ── IMAGE ── */}
            <div className="sticky top-20">
              {/* Badge */}
              <div className="flex gap-2 mb-4">
                <span className="bg-[#0C1A0E] text-[#7AB87A] text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase">
                  Édition Spéciale
                </span>
                <span className="bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase">
                  Stock Limité
                </span>
              </div>

              {/* Main image */}
              <div className="rounded-[20px] overflow-hidden bg-[#F5F0EB] aspect-square">
                <img
                  key={color}
                  src={FENNECS_IMAGES[color]}
                  alt={`Les Fennecs ${colorLabel}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>

              {/* Color thumbnails */}
              <div className="flex gap-3 mt-4 justify-center">
                {COLORS.map(c => (
                  <button
                    key={c.key}
                    onClick={() => setColor(c.key)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      color === c.key ? 'border-[#0C1A0E] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={FENNECS_IMAGES[c.key]} alt={c.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── INFOS + COMMANDE ── */}
            <div className="flex flex-col gap-6">

              {/* Titre */}
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#8B7355] mb-1">
                  Caractère Store × World Cup 2026
                </p>
                <h1 className="text-[36px] md:text-[44px] font-black tracking-tight text-[#0C1A0E] leading-none mb-2">
                  Les Fennecs
                </h1>
                <p className="text-[14px] text-gray-500">{PRODUCT.subtitle}</p>
              </div>

              {/* Badges qualité */}
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1.5 bg-[#F0F7F0] text-[#0C4A1E] text-[12px] font-bold rounded-full border border-[#0C4A1E]/15">
                  {PRODUCT.gsm}
                </span>
                <span className="px-3 py-1.5 bg-[#F0F7F0] text-[#0C4A1E] text-[12px] font-bold rounded-full border border-[#0C4A1E]/15">
                  {PRODUCT.qualite}
                </span>
                <span className="px-3 py-1.5 bg-[#F5F0EB] text-[#6B5B3E] text-[12px] font-bold rounded-full border border-[#6B5B3E]/15">
                  {PRODUCT.coupe}
                </span>
                <span className="px-3 py-1.5 bg-[#F5F0EB] text-[#6B5B3E] text-[12px] font-bold rounded-full border border-[#6B5B3E]/15">
                  {PRODUCT.matiere}
                </span>
              </div>

              {/* Prix */}
              <div className="flex items-baseline gap-3">
                <span className="text-[38px] font-black text-[#0C1A0E]">
                  {PRODUCT.prix.toLocaleString('fr-FR')}
                </span>
                <span className="text-[18px] font-semibold text-gray-500">DA</span>
                <span className="text-[12px] text-gray-400 ml-1">/ pièce · livraison incluse</span>
              </div>

              <div className="h-px bg-black/[0.06]" />

              {/* Couleur */}
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                  Couleur — <span className="text-[#0C1A0E] normal-case font-semibold">{colorLabel}</span>
                </p>
                <div className="flex gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c.key}
                      onClick={() => setColor(c.key)}
                      title={c.label}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                        color === c.key
                          ? 'border-[#0C1A0E] scale-110 shadow-md'
                          : 'border-black/15 hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: c.hex,
                        boxShadow: c.hex === '#F5F5F0' ? 'inset 0 0 0 1px #ddd' : undefined,
                      }}
                    >
                      {color === c.key && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-[14px] font-bold"
                            style={{ color: c.hex === '#F5F5F0' ? '#333' : '#fff' }}
                          >✓</span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Taille */}
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                  Taille{taille ? ` — ${taille}` : ''}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {TAILLES.map(t => (
                    <button
                      key={t}
                      onClick={() => setTaille(t)}
                      className={`w-14 h-14 rounded-xl text-[14px] font-bold border-2 transition-all ${
                        taille === t
                          ? 'bg-[#0C1A0E] text-white border-[#0C1A0E] scale-105 shadow-md'
                          : 'bg-white text-[#0C1A0E] border-black/15 hover:border-[#0C1A0E]/40'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  Coupe Oversized — prenez votre taille habituelle
                </p>
              </div>

              {/* Quantité */}
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-gray-500 mb-3">Quantité</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full border border-black/15 text-[18px] font-bold flex items-center justify-center hover:border-black/30 transition-colors"
                  >−</button>
                  <span className="text-[18px] font-bold w-8 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(10, q + 1))}
                    className="w-10 h-10 rounded-full border border-black/15 text-[18px] font-bold flex items-center justify-center hover:border-black/30 transition-colors"
                  >+</button>
                  <span className="text-[12px] text-gray-400 ml-2">max 10 / commande</span>
                </div>
              </div>

              <div className="h-px bg-black/[0.06]" />

              {/* Récap */}
              {taille && (
                <div className="bg-[#F5F0EB] rounded-2xl px-5 py-4 flex justify-between items-center">
                  <div>
                    <p className="text-[12px] text-gray-500">Total estimé</p>
                    <p className="text-[11px] text-gray-400">{PRODUCT.nom} · {colorLabel} · {taille} · ×{qty}</p>
                  </div>
                  <p className="text-[22px] font-black text-[#0C1A0E]">{totalPrice} DA</p>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={buildWhatsApp}
                  disabled={!canOrder}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[16px] font-bold transition-all ${
                    canOrder
                      ? 'bg-[#0C1A0E] text-white hover:bg-[#1A3D2B] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {canOrder ? `Commander sur WhatsApp` : 'Choisissez une taille'}
                </button>

                {!canOrder && (
                  <p className="text-[12px] text-center text-gray-400">
                    Sélectionnez une couleur et une taille pour commander
                  </p>
                )}

                <a
                  href={`https://wa.me/213557440522?text=${encodeURIComponent('Bonjour, j\'ai une question sur le t-shirt Les Fennecs World Cup 2026')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full text-center border border-black/15 text-gray-700 py-3.5 rounded-2xl text-[14px] font-medium hover:border-black/30 transition-colors no-underline"
                >
                  💬 Une question ? WhatsApp
                </a>
              </div>

              {/* Détails produit */}
              <div className="border border-black/[0.07] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 bg-[#F9F9F9] border-b border-black/[0.06]">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-gray-500">Détails du produit</p>
                </div>
                <div className="divide-y divide-black/[0.05]">
                  {PRODUCT.details.map((d, i) => (
                    <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                      <span className="text-[18px]">{d.icon}</span>
                      <span className="text-[13px] text-gray-700">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paiement */}
              <div className="bg-[#F0F7F0] rounded-2xl px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#0C4A1E] mb-2">Paiement & Livraison</p>
                <p className="text-[13px] text-[#1A3D2B] leading-relaxed">
                  Paiement à la livraison · BaridiMob · CCP.<br />
                  Livraison nationale sous 3–5 jours ouvrés.
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
