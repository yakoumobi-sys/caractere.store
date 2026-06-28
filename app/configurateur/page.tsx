'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Produit, Couleur, Taille } from '@/types'
import Navbar from '@/components/layout/Navbar'

interface OrderState {
  step: number
  produit: Produit | null
  quantite: number
  couleur: string
  couleurHex: string
  tailles: string[]
  logoFile: File | null
  logoUrl: string | null
  logoUploadUrl: string | null
  position: string
  technique: string
  urgent: boolean
  nom: string
  entreprise: string
  telephone: string
  email: string
  notes: string
  whatsappMsg: string
}

const DEFAULT: OrderState = {
  step: 1, produit: null, quantite: 1,
  couleur: 'Blanc', couleurHex: '#FFFFFF', tailles: ['M'],
  logoFile: null, logoUrl: null, logoUploadUrl: null,
  position: 'Logo petit — côté coeur', technique: 'DTF',
  urgent: false, nom: '', entreprise: '', telephone: '', email: '', notes: '',
  whatsappMsg: ''
}

const TECHNIQUES = ['Broderie', 'DTF', 'Conseil équipe']

const PRODUCT_IMAGES: Record<string, string> = {
  'T-shirt': 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/IMG_5850.jpeg',
  'T-shirt Oversized 250GSM': 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/tshirt-oversized.jpeg',
  'Polo': 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/IMG_5851.jpeg',
  'Casquette': 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/IMG_5853.jpeg',
  'Totebag': 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/IMG_5854.jpeg',
  'Gilet de travail': 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/IMG_5852.jpeg',
  'Gilet de securite': 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/images.jpg',
  'Tablier': 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/png-clipart-apron-apron-thumbnail.png',
}
const FALLBACK_IMG = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/IMG_5509.png'

export default function ConfigurateurPage() {
  const [order, setOrder] = useState<OrderState>(DEFAULT)
  const [produits, setProduits] = useState<Produit[]>([])
  const [couleurs, setCouleurs] = useState<Couleur[]>([])
  const [tailles, setTailles] = useState<Taille[]>([])
  const [refCode, setRefCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [fromDesigner, setFromDesigner] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fallbackProduits = [
      { id: '1', nom: 'T-shirt', emoji: '', description: '100% coton, broderie ou DTF', prix_base: 1950, actif: true, ordre: 1 },
      { id: '2', nom: 'Polo', emoji: '', description: 'Piqué coton premium', prix_base: 2300, actif: true, ordre: 2 },
      { id: '3', nom: 'Gilet de travail', emoji: '', description: 'Gilet multipoches personnalisé', prix_base: 2500, actif: true, ordre: 3 },
      { id: '4', nom: 'Gilet de securite', emoji: '', description: 'Haute visibilité', prix_base: 1600, actif: true, ordre: 4 },
      { id: '5', nom: 'Casquette', emoji: '', description: 'Broderie structurée', prix_base: 1200, actif: true, ordre: 5 },
      { id: '6', nom: 'Totebag', emoji: '', description: 'Coton canvas DTF', prix_base: 950, actif: true, ordre: 6 },
      { id: '7', nom: 'Tablier', emoji: '', description: 'Cuisine ou commerce', prix_base: 1500, actif: true, ordre: 7 },
    ]
    const fallbackCouleurs = [
      { id: '1', nom: 'Noir', hex: '#1A1A1A', actif: true, ordre: 1, produits: [] },
      { id: '2', nom: 'Blanc', hex: '#FFFFFF', actif: true, ordre: 2, produits: [] },
      { id: '3', nom: 'Rouge', hex: '#CC1111', actif: true, ordre: 3, produits: [] },
      { id: '4', nom: 'Bleu Nuit', hex: '#1B2A4A', actif: true, ordre: 5, produits: [] },
      { id: '5', nom: 'Bleu Roi', hex: '#1A5DC8', actif: true, ordre: 6, produits: [] },
      { id: '6', nom: 'Vert', hex: '#1A9A3C', actif: true, ordre: 8, produits: [] },
      { id: '7', nom: 'Bordeaux', hex: '#6B1A2A', actif: true, ordre: 9, produits: [] },
      { id: '8', nom: 'Gris', hex: '#888888', actif: true, ordre: 13, produits: [] },
      { id: '9', nom: 'Beige', hex: '#E8D5B0', actif: true, ordre: 12, produits: [] },
    ]
    const fallbackTailles = [
      { id: '1', nom: 'XS', actif: true, ordre: 1 },
      { id: '2', nom: 'S', actif: true, ordre: 2 },
      { id: '3', nom: 'M', actif: true, ordre: 3 },
      { id: '4', nom: 'L', actif: true, ordre: 4 },
      { id: '5', nom: 'XL', actif: true, ordre: 5 },
      { id: '6', nom: 'XXL', actif: true, ordre: 6 },
    ]
    Promise.all([
      supabase.from('produits').select('*').eq('actif', true).order('ordre'),
      supabase.from('couleurs').select('*').eq('actif', true).order('ordre'),
      supabase.from('tailles').select('*').eq('actif', true).order('ordre'),
    ]).then(([p, c, t]) => {
      setProduits(p.data && p.data.length > 0 ? p.data : fallbackProduits)
      setCouleurs(c.data && c.data.length > 0 ? c.data : fallbackCouleurs)
      setTailles(t.data && t.data.length > 0 ? t.data : fallbackTailles)
    }).catch(() => {
      setProduits(fallbackProduits)
      setCouleurs(fallbackCouleurs)
      setTailles(fallbackTailles)
    })
  }, [])

  useEffect(() => {
    if (produits.length === 0 || couleurs.length === 0) return
    const params = new URLSearchParams(window.location.search)
    const produitNom = params.get('produit')
    const couleurNom = params.get('couleur')
    if (!produitNom) return
    const matchProduit = produits.find(p => p.nom === produitNom)
    const matchCouleur = couleurs.find(c => c.nom === couleurNom)
    setOrder(prev => ({
      ...prev,
      produit: matchProduit ?? prev.produit,
      couleur: couleurNom ?? prev.couleur,
      couleurHex: matchCouleur?.hex ?? prev.couleurHex,
      step: 2,
    }))
    try {
      const raw = sessionStorage.getItem('designer_layers')
      if (raw) {
        const layers = JSON.parse(raw)
        if (Array.isArray(layers) && layers.length > 0) {
          const first = layers[0]
          fetch(first.src).then(res => res.blob()).then(blob => {
            const file = new File([blob], first.name || 'logo-designer.png', { type: blob.type })
            setOrder(prev => ({ ...prev, logoFile: file, logoUrl: first.src }))
          }).catch(() => { })
        }
        sessionStorage.removeItem('designer_layers')
      }
    } catch (e) { }
    setFromDesigner(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [produits, couleurs])

  const up = (patch: Partial<OrderState>) => setOrder(prev => ({ ...prev, ...patch }))

  const calcPrice = () => {
    if (!order.produit) return { unit: 0, total: 0, remise: 0 }
    const r = order.quantite >= 100 ? 0.10 : order.quantite >= 50 ? 0.05 : 0
    const unit = Math.round(order.produit.prix_base * (1 - r))
    return { unit, total: unit * order.quantite, remise: r }
  }

  const next = () => { up({ step: order.step + 1 }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const prev = () => { up({ step: order.step - 1 }); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const handleFile = async (file: File) => {
    if (file.type.startsWith('image/')) {
      const r = new FileReader()
      r.onload = e => up({ logoFile: file, logoUrl: e.target?.result as string })
      r.readAsDataURL(file)
    } else {
      up({ logoFile: file, logoUrl: null })
    }
    setUploadingLogo(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload-logo', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) up({ logoUploadUrl: data.url })
    } catch (e) { }
    setUploadingLogo(false)
  }

  const buildWhatsAppMsg = (ref: string) => {
    const { unit, total } = calcPrice()
    return `Bonjour Caractère Store 👋

*Nouvelle commande — ${ref}*

🛍️ Produit : ${order.produit?.nom}
🎨 Couleur : ${order.couleur}
📏 Tailles : ${order.tailles.join(', ')}
📦 Quantité : ${order.quantite} pièce${order.quantite > 1 ? 's' : ''}
🖨️ Technique : ${order.technique}
📍 Position : ${order.position}${order.urgent ? '\n⚡ COMMANDE URGENTE' : ''}

👤 Nom : ${order.nom}
🏢 Entreprise : ${order.entreprise || 'Particulier'}
📞 Téléphone : ${order.telephone}
📧 Email : ${order.email || '-'}${order.notes ? `\n📝 Notes : ${order.notes}` : ''}

💰 Total estimé : ${total.toLocaleString('fr-FR')} DA`
  }

  const handleSubmit = async () => {
    if (!order.nom || !order.telephone) return alert('Nom et téléphone requis.')
    setLoading(true)
    const ref = 'CAR-' + Date.now().toString(36).toUpperCase()
    const { unit, total } = calcPrice()
    await fetch('/api/commandes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference: ref, produit: order.produit?.nom, quantite: order.quantite,
        couleur: order.couleur, tailles: order.tailles, position: order.position,
        technique: order.technique, urgent: order.urgent, nom_client: order.nom,
        entreprise: order.entreprise, telephone: order.telephone, email: order.email,
        notes: order.notes, logo_url: order.logoUploadUrl, prix_unitaire: unit, prix_total: total,
      })
    })
    setRefCode(ref)
    setLoading(false)
    up({ step: 6, whatsappMsg: buildWhatsAppMsg(ref) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const { unit, total, remise } = calcPrice()

  // ─── STEP LABELS ──────────────────────────────────────────────────────────
  const STEPS = [
    { n: 1, label: 'Produit' },
    { n: 2, label: 'Options' },
    { n: 3, label: 'Logo' },
    { n: 5, label: 'Contact' },
  ]
  const stepIndex = [1, 2, 3, 5].indexOf(order.step)

  // ─── COULEURS FILTRÉES ────────────────────────────────────────────────────
  const couleursFiltrees = couleurs.filter(c =>
    !order.produit || !c.produits || c.produits.length === 0 || c.produits.includes(order.produit.nom)
  )

  // ─── PREVIEW IMAGE ────────────────────────────────────────────────────────
  const previewImg = order.produit ? (PRODUCT_IMAGES[order.produit.nom] || FALLBACK_IMG) : null

  // ─── CONFIRMATION ─────────────────────────────────────────────────────────
  if (order.step === 6) {
    return (
      <>
        <Navbar />
        <main className="pt-14 min-h-screen bg-white">
          <div className="max-w-[480px] mx-auto px-6 py-20 text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-[28px] font-bold tracking-tight mb-2">Demande enregistrée</h2>
            <p className="text-[14px] text-brand-gray mb-6">Confirmez sur WhatsApp — notre équipe répond sous 2h.</p>

            {/* Ref */}
            <div className="bg-brand-light rounded-2xl px-6 py-4 inline-block mb-8">
              <p className="text-[11px] font-bold tracking-widest uppercase text-brand-gray mb-1">Référence</p>
              <p className="text-[22px] font-bold font-mono tracking-widest text-brand-dark">{refCode}</p>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/213557440522?text=${encodeURIComponent(order.whatsappMsg)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 rounded-2xl text-[16px] font-bold transition-all shadow-lg shadow-green-200/50 mb-6 w-full"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Confirmer sur WhatsApp
            </a>

            {/* Récap */}
            <div className="bg-brand-light rounded-2xl p-5 text-left mb-6">
              <p className="text-[11px] font-bold tracking-widest uppercase text-brand-gray mb-4">Récapitulatif</p>
              {[
                ['Produit', order.produit?.nom ?? '-'],
                ['Couleur', order.couleur],
                ['Tailles', order.tailles.join(', ')],
                ['Quantité', `${order.quantite} pièce${order.quantite > 1 ? 's' : ''}`],
                ['Technique', order.technique],
                ['Total estimé', `${total.toLocaleString('fr-FR')} DA`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2 border-b border-black/[0.06] last:border-0">
                  <span className="text-[13px] text-brand-gray">{label}</span>
                  <span className="text-[13px] font-semibold text-brand-dark">{val}</span>
                </div>
              ))}
            </div>

            <a href={`/suivi/${refCode}`} className="block text-[13px] font-semibold text-brand-dark underline mb-3">
              Suivre ma commande
            </a>
            <button onClick={() => { setOrder(DEFAULT); setRefCode('') }} className="text-[13px] text-brand-gray bg-transparent border-none cursor-pointer underline">
              Nouvelle commande
            </button>
          </div>
        </main>
      </>
    )
  }

  // ─── MAIN LAYOUT ──────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      {/* ── Barre de progression sticky ── */}
      <div className="sticky top-14 z-40 bg-white/95 backdrop-blur-md border-b border-black/[0.07]">
        <div className="max-w-[1080px] mx-auto px-6 py-3 flex items-center justify-between">
          {/* Steps */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => {
              const done = stepIndex > i
              const active = stepIndex === i
              return (
                <div key={s.n} className="flex items-center">
                  {i > 0 && <div className={`w-8 h-px mx-1 ${done ? 'bg-brand-dark' : 'bg-black/12'}`} />}
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all flex-shrink-0
                      ${done ? 'bg-brand-dark text-white' : active ? 'bg-brand-dark text-white ring-4 ring-brand-dark/15' : 'bg-black/[0.06] text-brand-gray'}`}>
                      {done
                        ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
                        : s.n
                      }
                    </div>
                    <span className={`text-[12px] font-medium hidden sm:block ${active ? 'text-brand-dark' : done ? 'text-brand-dark/60' : 'text-brand-gray'}`}>{s.label}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Prix résumé rapide */}
          {order.produit && (
            <div className="text-right">
              <p className="text-[11px] text-brand-gray leading-none mb-0.5">Total estimé</p>
              <p className="text-[16px] font-bold text-brand-dark leading-none">{total.toLocaleString('fr-FR')} DA</p>
            </div>
          )}
        </div>
      </div>

      <main className="pt-6 min-h-screen bg-white">
        <div className="max-w-[1080px] mx-auto px-6 pb-20">

          {/* ─────── LAYOUT 2 colonnes ─────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">

            {/* ── Colonne gauche : formulaire ── */}
            <div>

              {/* Banner "depuis Designer" */}
              {fromDesigner && order.step === 2 && (
                <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl px-4 py-3">
                  <span className="text-green-600 text-[18px]">✓</span>
                  <p className="text-[13px] text-green-800">
                    <strong>{order.produit?.nom}</strong> · {order.couleur} · Logo importé depuis le Designer
                  </p>
                </div>
              )}

              {/* ═══ ÉTAPE 1 : Produit ═══ */}
              {order.step === 1 && (
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-brand-gray mb-2">Étape 1</p>
                  <h1 className="text-[26px] font-bold tracking-tight mb-1">Quel produit personnaliser ?</h1>
                  <p className="text-[14px] text-brand-gray mb-8">Choisissez le textile sur lequel on va imprimer votre logo.</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {produits.map(p => {
                      const imgUrl = PRODUCT_IMAGES[p.nom] || FALLBACK_IMG
                      const selected = order.produit?.id === p.id
                      return (
                        <button
                          key={p.id}
                          onClick={() => up({ produit: p, step: 2 })}
                          className={`text-left rounded-2xl border-2 transition-all bg-white overflow-hidden group
                            ${selected ? 'border-brand-dark shadow-md' : 'border-black/10 hover:border-black/30 hover:shadow-sm'}`}
                        >
                          {/* Image */}
                          <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F5F5F3]">
                            <img
                              src={imgUrl} alt={p.nom}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {selected && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-brand-dark rounded-full flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                  <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                              </div>
                            )}
                          </div>
                          {/* Infos */}
                          <div className="p-3.5">
                            <p className="text-[14px] font-semibold tracking-tight leading-tight">{p.nom}</p>
                            <p className="text-[11px] text-brand-gray mt-0.5 leading-snug">{p.description}</p>
                            <p className="text-[13px] font-bold mt-2 text-brand-dark">dès {p.prix_base.toLocaleString('fr-FR')} DA</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ═══ ÉTAPE 2 : Couleur + Tailles + Quantité ═══ */}
              {order.step === 2 && (
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-brand-gray mb-2">Étape 2</p>
                  <h1 className="text-[26px] font-bold tracking-tight mb-1">Options de personnalisation</h1>
                  <p className="text-[14px] text-brand-gray mb-8">Couleur du textile, tailles et quantité.</p>

                  {/* Technique */}
                  <div className="mb-8">
                    <p className="text-[12px] font-bold tracking-widest uppercase text-brand-gray mb-3">Technique d'impression</p>
                    <div className="flex gap-2 flex-wrap">
                      {TECHNIQUES.map(t => (
                        <button
                          key={t}
                          onClick={() => up({ technique: t })}
                          className={`px-5 py-2.5 rounded-xl text-[13px] font-medium border-2 transition-all
                            ${order.technique === t ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-brand-dark border-black/15 hover:border-black/30'}`}
                        >
                          {t === 'DTF' ? '🖨️' : t === 'Broderie' ? '🪡' : '💬'} {t}
                        </button>
                      ))}
                    </div>
                    {order.technique === 'DTF' && (
                      <p className="text-[12px] text-brand-gray mt-2">Impression haute définition, tous supports, couleurs illimitées.</p>
                    )}
                    {order.technique === 'Broderie' && (
                      <p className="text-[12px] text-brand-gray mt-2">Finition textile premium, relief et durabilité maximale.</p>
                    )}
                  </div>

                  {/* Couleur */}
                  <div className="mb-8">
                    <p className="text-[12px] font-bold tracking-widest uppercase text-brand-gray mb-3">
                      Couleur du textile — <span className="normal-case font-semibold text-brand-dark">{order.couleur}</span>
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {couleursFiltrees.map(c => (
                        <button
                          key={c.id}
                          title={c.nom}
                          onClick={() => up({ couleur: c.nom, couleurHex: c.hex })}
                          className={`w-9 h-9 rounded-full border-2 transition-all ${order.couleur === c.nom ? 'border-brand-dark scale-110 shadow-md' : 'border-transparent hover:border-black/20'}`}
                          style={{ background: c.hex, boxShadow: c.hex === '#FFFFFF' ? 'inset 0 0 0 1px rgba(0,0,0,0.12)' : undefined }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tailles */}
                  <div className="mb-8">
                    <p className="text-[12px] font-bold tracking-widest uppercase text-brand-gray mb-3">
                      Tailles <span className="normal-case font-normal text-brand-gray/70">(sélection multiple)</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tailles.map(t => {
                        const sel = order.tailles.includes(t.nom)
                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              const s = sel ? order.tailles.filter(x => x !== t.nom) : [...order.tailles, t.nom]
                              up({ tailles: s })
                            }}
                            className={`w-14 py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-all
                              ${sel ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-brand-dark border-black/15 hover:border-black/30'}`}
                          >
                            {t.nom}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Quantité */}
                  <div className="mb-8">
                    <p className="text-[12px] font-bold tracking-widest uppercase text-brand-gray mb-3">Quantité</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => up({ quantite: Math.max(1, order.quantite - 1) })}
                        className="w-11 h-11 rounded-full border-2 border-black/15 flex items-center justify-center text-[20px] bg-white hover:border-black/30 transition-all font-light"
                      >−</button>
                      <input
                        type="number" min={1} value={order.quantite}
                        onChange={e => up({ quantite: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="w-20 text-center text-[20px] font-bold border-2 border-black/15 rounded-xl py-2 focus:outline-none focus:border-brand-dark"
                      />
                      <button
                        onClick={() => up({ quantite: order.quantite + 1 })}
                        className="w-11 h-11 rounded-full border-2 border-black/15 flex items-center justify-center text-[20px] bg-white hover:border-black/30 transition-all font-light"
                      >+</button>
                      <span className="text-[13px] text-brand-gray">pièces</span>
                    </div>

                    {/* Paliers remise */}
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {[
                        { label: '1–49 pcs', info: 'Prix normal', active: order.quantite < 50 },
                        { label: '50–99 pcs', info: '−5%', active: order.quantite >= 50 && order.quantite < 100 },
                        { label: '100+ pcs', info: '−10%', active: order.quantite >= 100 },
                      ].map(tier => (
                        <div key={tier.label} className={`px-3 py-2 rounded-xl border text-[12px] transition-all
                          ${tier.active ? 'border-green-400 bg-green-50 text-green-800' : 'border-black/10 bg-white text-brand-gray'}`}>
                          <span className="font-semibold">{tier.label}</span>
                          <span className="ml-1 opacity-70">{tier.info}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={prev} className="px-6 py-3 rounded-full border-2 border-black/15 text-[14px] font-medium hover:border-black/30 transition-all">
                      ← Retour
                    </button>
                    <button onClick={next} className="bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-semibold hover:bg-neutral-800 transition-colors flex-1 md:flex-none">
                      Continuer →
                    </button>
                  </div>
                </div>
              )}

              {/* ═══ ÉTAPE 3 : Logo ═══ */}
              {order.step === 3 && (
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-brand-gray mb-2">Étape 3</p>
                  <h1 className="text-[26px] font-bold tracking-tight mb-1">Votre logo ou design</h1>
                  <p className="text-[14px] text-brand-gray mb-8">
                    {fromDesigner ? 'Logo importé depuis le Designer.' : 'Uploadez le fichier de votre logo ou design.'}
                  </p>

                  {/* Zone drop */}
                  {!order.logoFile ? (
                    <div
                      className="border-2 border-dashed border-black/20 rounded-2xl p-14 text-center cursor-pointer hover:border-brand-dark hover:bg-brand-light/30 transition-all group"
                      onClick={() => fileRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                    >
                      <div className="w-14 h-14 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-dark/10 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <p className="text-[15px] font-semibold mb-1">Glissez votre fichier ici</p>
                      <p className="text-[13px] text-brand-gray mb-3">ou cliquez pour parcourir</p>
                      <p className="text-[11px] text-brand-gray/60 bg-brand-light rounded-lg px-3 py-1.5 inline-block">
                        AI · EPS · SVG · PDF · PNG · JPG
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-green-200 bg-green-50/50 rounded-2xl p-5 flex items-center gap-4 mb-4">
                      {order.logoUrl && (
                        <img src={order.logoUrl} alt="Logo" className="w-16 h-16 object-contain rounded-xl bg-white border border-black/10" />
                      )}
                      <div className="flex-1">
                        <p className="text-[14px] font-semibold">{order.logoFile.name}</p>
                        <p className="text-[12px] text-brand-gray">{(order.logoFile.size / 1024).toFixed(0)} Ko</p>
                        {uploadingLogo && <p className="text-[12px] text-brand-gray mt-1">Upload en cours…</p>}
                        {order.logoUploadUrl && !uploadingLogo && <p className="text-[12px] text-green-600 font-medium mt-1">✓ Fichier prêt</p>}
                      </div>
                      <button onClick={() => up({ logoFile: null, logoUrl: null, logoUploadUrl: null })} className="text-[12px] text-red-500 font-medium hover:text-red-700">
                        Supprimer
                      </button>
                    </div>
                  )}

                  <input ref={fileRef} type="file" className="hidden" accept=".ai,.eps,.svg,.pdf,.png,.jpg,.jpeg" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

                  {/* Info vectorisation */}
                  <div className="mt-6 flex items-start gap-3 bg-[#F0F7FF] rounded-2xl p-4">
                    <span className="text-[20px]">💡</span>
                    <div>
                      <p className="text-[13px] font-semibold text-[#1A3A5C] mb-0.5">Pas de logo vectoriel ?</p>
                      <p className="text-[12px] text-[#2A5080] leading-relaxed">
                        Envoyez ce que vous avez — même une photo ou un croquis. Notre équipe vectorise gratuitement pour toute commande.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button onClick={prev} className="px-6 py-3 rounded-full border-2 border-black/15 text-[14px] font-medium hover:border-black/30 transition-all">
                      ← Retour
                    </button>
                    <button
                      onClick={() => { up({ step: 5 }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      className="bg-brand-dark text-white px-8 py-3.5 rounded-full text-[15px] font-semibold hover:bg-neutral-800 transition-colors flex-1 md:flex-none"
                    >
                      {order.logoFile ? 'Continuer →' : 'Passer cette étape →'}
                    </button>
                  </div>
                </div>
              )}

              {/* ═══ ÉTAPE 5 : Contact ═══ */}
              {order.step === 5 && (
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-brand-gray mb-2">Étape 4</p>
                  <h1 className="text-[26px] font-bold tracking-tight mb-1">Vos coordonnées</h1>
                  <p className="text-[14px] text-brand-gray mb-8">Dernière étape — on vous contacte sous 2h.</p>

                  <div className="flex flex-col gap-4 max-w-[500px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-brand-dark">Nom complet *</label>
                        <input
                          type="text" value={order.nom} placeholder="Votre nom"
                          onChange={e => up({ nom: e.target.value })}
                          className="border-2 border-black/[0.10] focus:border-brand-dark rounded-xl px-4 py-2.5 text-[14px] outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-brand-dark">Entreprise</label>
                        <input
                          type="text" value={order.entreprise} placeholder="Nom entreprise (optionnel)"
                          onChange={e => up({ entreprise: e.target.value })}
                          className="border-2 border-black/[0.10] focus:border-brand-dark rounded-xl px-4 py-2.5 text-[14px] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-brand-dark">Téléphone *</label>
                        <input
                          type="tel" value={order.telephone} placeholder="+213 6XX XXX XXX"
                          onChange={e => up({ telephone: e.target.value })}
                          className="border-2 border-black/[0.10] focus:border-brand-dark rounded-xl px-4 py-2.5 text-[14px] outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-brand-dark">Email</label>
                        <input
                          type="email" value={order.email} placeholder="votre@email.com"
                          onChange={e => up({ email: e.target.value })}
                          className="border-2 border-black/[0.10] focus:border-brand-dark rounded-xl px-4 py-2.5 text-[14px] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Commande urgente */}
                    <div
                      className={`flex items-center justify-between rounded-2xl px-4 py-4 border-2 cursor-pointer transition-all
                        ${order.urgent ? 'bg-orange-50 border-orange-300' : 'bg-brand-light border-transparent'}`}
                      onClick={() => up({ urgent: !order.urgent })}
                    >
                      <div>
                        <p className="text-[14px] font-semibold">⚡ Commande urgente</p>
                        <p className="text-[12px] text-brand-gray">Livraison express prioritaire</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${order.urgent ? 'bg-orange-500' : 'bg-black/20'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow ${order.urgent ? 'left-6' : 'left-0.5'}`} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-brand-dark">Notes complémentaires</label>
                      <textarea
                        value={order.notes} rows={3}
                        placeholder="Position du logo, détails couleur, délai souhaité…"
                        onChange={e => up({ notes: e.target.value })}
                        className="border-2 border-black/[0.10] focus:border-brand-dark rounded-xl px-4 py-2.5 text-[14px] outline-none resize-none transition-colors leading-relaxed placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button onClick={() => { up({ step: 3 }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="px-6 py-3 rounded-full border-2 border-black/15 text-[14px] font-medium hover:border-black/30 transition-all">
                      ← Retour
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !order.nom || !order.telephone}
                      className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-full text-[15px] font-bold transition-all flex-1 md:flex-none justify-center"
                    >
                      {loading ? (
                        <span>Enregistrement…</span>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Envoyer sur WhatsApp
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[12px] text-brand-gray mt-4">
                    En confirmant, un résumé de votre commande s'ouvrira dans WhatsApp.
                  </p>
                </div>
              )}

            </div>

            {/* ── Colonne droite : résumé sticky ── */}
            <div className="hidden lg:block">
              <div className="sticky top-28 space-y-4">

                {/* Aperçu produit */}
                {order.produit && previewImg && (
                  <div className="rounded-2xl overflow-hidden bg-[#F5F5F3] aspect-square">
                    <img
                      src={previewImg}
                      alt={order.produit.nom}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Récap */}
                <div className="bg-brand-light rounded-2xl p-5">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-brand-gray mb-4">Récapitulatif</p>

                  <div className="space-y-0">
                    {[
                      { label: 'Produit', value: order.produit?.nom ?? '—', empty: !order.produit },
                      { label: 'Technique', value: order.technique },
                      { label: 'Quantité', value: `${order.quantite} pièce${order.quantite > 1 ? 's' : ''}` },
                      { label: 'Couleur', value: order.couleur, color: order.couleurHex },
                      { label: 'Tailles', value: order.tailles.length ? order.tailles.join(', ') : '—', empty: !order.tailles.length },
                      { label: 'Logo', value: order.logoFile ? order.logoFile.name : 'Non uploadé', empty: !order.logoFile },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-black/[0.06] last:border-0 gap-2">
                        <span className="text-[12px] text-brand-gray flex-shrink-0">{row.label}</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          {row.color && (
                            <span
                              className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/10"
                              style={{ backgroundColor: row.color }}
                            />
                          )}
                          <span className={`text-[12px] font-medium text-right truncate ${row.empty ? 'text-brand-gray/50' : 'text-brand-dark'}`}>
                            {row.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Prix */}
                  {order.produit && (
                    <div className="mt-4 pt-4 border-t border-black/[0.08]">
                      {remise > 0 && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[12px] text-green-700">Remise volume</span>
                          <span className="text-[12px] font-semibold text-green-700">−{Math.round(remise * 100)}%</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[12px] text-brand-gray">Prix unitaire</span>
                        <span className="text-[14px] font-semibold text-brand-dark">{unit.toLocaleString('fr-FR')} DA</span>
                      </div>
                      <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-black/[0.06]">
                        <span className="text-[13px] font-semibold text-brand-dark">Total estimé</span>
                        <span className="text-[22px] font-bold tracking-tight text-brand-dark">{total.toLocaleString('fr-FR')} DA</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Garanties */}
                <div className="rounded-2xl border border-black/[0.07] p-4 space-y-3">
                  {[
                    { icon: '🚚', title: 'Livraison nationale', sub: '3–5 jours ouvrés' },
                    { icon: '💳', title: 'Paiement à la livraison', sub: 'BaridiMob · CCP' },
                    { icon: '🎨', title: 'Vectorisation offerte', sub: 'Pour toute commande' },
                  ].map(g => (
                    <div key={g.title} className="flex items-center gap-3">
                      <span className="text-[18px]">{g.icon}</span>
                      <div>
                        <p className="text-[12px] font-semibold text-brand-dark leading-tight">{g.title}</p>
                        <p className="text-[11px] text-brand-gray">{g.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
