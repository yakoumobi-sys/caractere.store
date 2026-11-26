'use client'

import Link from 'next/link'
import { CARACTERISE_PRODUCTS } from '@/lib/caracterise'
import { useEffect, useRef, useState } from 'react'
import styles from './simulation.module.css'

const NUMBER = '213557440522'
const MAX_BYTES = 4 * 1024 * 1024
const TYPES = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
const PRODUCTS = [
  CARACTERISE_PRODUCTS[1],
  CARACTERISE_PRODUCTS[0],
  CARACTERISE_PRODUCTS[2],
  { id: 'casquette', label: 'Casquette', cutout: '/home-cutouts/casquette.png' },
  { id: 'hoodie', label: 'Hoodie', cutout: '/home-cutouts/hoodie.png' },
  { id: 'tablier', label: 'Tablier', cutout: '/designer-mockups/tablier_new.png' },
  { id: 'tote-bag', label: 'Tote bag', cutout: '/home-cutouts/tote-bag.png' },
  { id: 'autre', label: 'Autre / À conseiller', cutout: '' },
] as const

const PRODUCT_ALIASES: Record<string, string> = {
  tshirt_oversized: 'tshirt',
  gilet_securite: 'gilet',
  totebag: 'tote-bag',
}

function trackSimulation(event: string, parameters: Record<string, string> = {}) {
  if (typeof window === 'undefined') return
  const pixel = (window as Window & { fbq?: (action: string, name: string, data?: Record<string, string>) => void }).fbq
  if (event === 'Lead') pixel?.('track', 'Lead', parameters)
  else pixel?.('trackCustom', event, parameters)
}

export default function SimulationForm({ productId, caracterise }: { productId?: string; caracterise: boolean }) {
  const products = caracterise ? CARACTERISE_PRODUCTS : PRODUCTS
  const initialProduct = products.find(item => item.id === productId || item.id === PRODUCT_ALIASES[productId ?? ''])
  const [product, setProduct] = useState<string>(initialProduct?.label ?? (caracterise ? '' : 'Polo'))
  const selectedProduct = products.find(item => item.label === product)
  const [color, setColor] = useState('')
  const [details, setDetails] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const [prepared, setPrepared] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [shareNote, setShareNote] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const requestLock = useRef(false)
  const reader = useRef<FileReader | null>(null)

  useEffect(() => () => reader.current?.abort(), [])
  useEffect(() => {
    try { setCanShare(Boolean(file && navigator.canShare?.({ files: [file] }))) }
    catch { setCanShare(false) }
  }, [file])

  function chooseFile(next?: File) {
    if (requestLock.current || !next) return
    reader.current?.abort()
    setError(''); setShareNote(''); setPrepared(false); setLogoUrl(''); setFile(null); setPreview('')
    if (!TYPES.includes(next.type) || !/\.(png|jpe?g|webp|pdf)$/i.test(next.name)) {
      setError('Choisissez un fichier PNG, JPG, WEBP ou PDF.'); return
    }
    if (!next.size || next.size > MAX_BYTES) {
      setError('Votre logo doit peser moins de 4 Mo. Choisissez un fichier plus léger.'); return
    }
    setFile(next)
    trackSimulation('logo_selected', { product })
    if (next.type.startsWith('image/')) {
      const nextReader = new FileReader()
      reader.current = nextReader
      nextReader.onload = () => setPreview(String(nextReader.result))
      nextReader.readAsDataURL(next)
    }
  }

  function message(url?: string) {
    const request = caracterise
      ? 'Bonjour Caractère, je souhaite une simulation gratuite pour un vêtement caractérisé.'
      : 'Bonjour Caractère, je souhaite une simulation gratuite avec mon logo.'
    return [
      request,
      product && `Article : ${product}`,
      quantity && `Quantité : ${quantity}`,
      color.trim() && `Couleur souhaitée : ${color.trim()}`,
      details.trim() && `Précisions : ${details.trim()}`,
      url ? `Mon logo : ${url}` : 'Je vais joindre mon logo ici.',
    ].filter(Boolean).join('\n')
  }
  function whatsapp(url?: string) {
    return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message(url))}`
  }

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (requestLock.current) return
    if (!file) { setError('Ajoutez votre logo pour demander votre simulation.'); input.current?.focus(); return }
    trackSimulation('simulation_started', { product })
    requestLock.current = true; setBusy(true); setError('')
    try {
      let url = logoUrl
      if (!url) {
        const form = new FormData(); form.append('file', file)
        const controller = new AbortController()
        const timeout = window.setTimeout(() => controller.abort(), 30000)
        try {
          const response = await fetch('/api/upload-logo', { method: 'POST', body: form, signal: controller.signal })
          const data = await response.json()
          if (!response.ok || typeof data.url !== 'string') throw new Error(data.error || 'Le logo n’a pas pu être chargé. Réessayez.')
          const parsed = new URL(data.url)
          if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.supabase.co')) throw new Error('Le lien du logo est invalide. Réessayez.')
          url = parsed.href
          setLogoUrl(url)
        } finally { window.clearTimeout(timeout) }
      }
      setPrepared(true)
      trackSimulation('logo_uploaded', { product })
      trackSimulation('Lead', { content_name: 'simulation_gratuite', product })
      window.setTimeout(() => window.location.assign(whatsapp(url)), 250)
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== 'AbortError' && cause.name !== 'TypeError' ? cause.message : 'Connexion interrompue. Votre logo est toujours ici : réessayez ou contactez-nous directement.')
    } finally { requestLock.current = false; setBusy(false) }
  }

  async function shareFile() {
    if (!file) return
    setShareNote('')
    try {
      await navigator.share({ files: [file], title: 'Simulation gratuite Caractère', text: message().replace('Je vais joindre mon logo ici.', 'Mon logo est joint.') })
      setShareNote('Vérifiez l’envoi dans votre conversation WhatsApp avec Caractère.')
    } catch (cause) {
      if (!(cause instanceof Error && cause.name === 'AbortError')) setShareNote('Le partage est indisponible ici. Utilisez le bouton WhatsApp : le lien de votre logo sera inclus.')
    }
  }

  return (
    <main className={`${styles.page} ${caracterise ? styles.caracterise : ''}`}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Caractère, accueil">Caractère<span>®</span></Link>
        <Link href={caracterise ? "/#modeles" : "/produits"} className={styles.catalogue}>Voir les vêtements</Link>
      </header>
      <div className={styles.layout}>
        <section className={styles.intro}>
          <p className={styles.badge}><span aria-hidden="true" />Simulation gratuite</p>
          <h1>{caracterise ? "Créez votre vêtement caractérisé." : <>Votre logo mérite<br />du caractère.</>}</h1>
          <p className={styles.lead}>{caracterise ? "L’atelier compose le design à partir des formes et des couleurs de votre logo. Vous validez la simulation avant de commander." : <>Voyez votre logo sur nos vêtements<br className={styles.desktopBreak} /> avant de commander.</>}</p>
          {selectedProduct?.cutout && <div className={styles.productStage}>
            <img src={selectedProduct.cutout} alt={`${selectedProduct.label} à personnaliser`} className={styles.polo} />
            <div className={styles.logoCard}>
              {preview ? <img src={preview} alt="Votre logo sélectionné" /> : <span>{file ? 'Votre logo PDF' : 'Votre logo ici'}</span>}
              <small>{file ? 'Logo sélectionné' : 'Et si on essayait ?'}</small>
            </div>
            <p className={styles.stageCaption}>La simulation sera préparée par notre équipe.</p>
          </div>}
        </section>
        <section className={styles.formPanel} aria-labelledby="form-title">
          <h2 id="form-title">{caracterise ? "Décrivez votre projet." : "On commence par votre logo."}</h2>
          <p className={styles.formIntro}>Ajoutez-le ici. Notre équipe vous accompagne sur WhatsApp.</p>
          <form onSubmit={send}>
            <fieldset disabled={busy} className={styles.fields}>
              <label className={styles.upload} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]) }}>
                <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,application/pdf,.png,.jpg,.jpeg,.webp,.pdf" onChange={event => { chooseFile(event.target.files?.[0]); event.target.value = '' }} aria-label="Ajouter votre logo" aria-describedby="file-help" />
                {preview ? <img src={preview} alt="Aperçu du logo ajouté" className={styles.thumbnail} /> : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M12 16V3m-5 5 5-5 5 5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" /></svg>}
                <strong>{file ? file.name : 'Ajoutez votre logo'}</strong>
                <span id="file-help">{file ? 'Appuyez pour changer de fichier' : 'PNG, JPG, WEBP ou PDF · 4 Mo maximum'}</span>
              </label>
              <div className={styles.options}>
                <label>Sur quel article ?
                  <select value={product} required onChange={event => { setProduct(event.target.value); setPrepared(false) }}>
                    {caracterise && <option value="" disabled>Choisir un vêtement</option>}
                    {products.map(item => <option key={item.id} value={item.label}>{item.label}</option>)}
                  </select>
                </label>
                <label>Quantité <span>(facultatif)</span><input type="number" min="1" max="100000" step="1" inputMode="numeric" placeholder="Ex. 20" value={quantity} onChange={event => { setQuantity(event.target.value); setPrepared(false) }} /></label>
              </div>
              {caracterise && <div className={styles.preferences}>
                <label>Couleur du vêtement <span>(facultatif)</span>
                  <input type="text" maxLength={60} placeholder="Ex. bleu nuit" value={color} onChange={event => { setColor(event.target.value); setPrepared(false) }} />
                </label>
                <label>Précisions <span>(facultatif)</span>
                  <textarea rows={2} maxLength={350} placeholder="Ex. polo manches longues, grand visuel au dos" value={details} onChange={event => { setDetails(event.target.value); setPrepared(false) }} />
                </label>
              </div>}
              <p className={styles.privacy}>En continuant, votre logo sera chargé pour que notre équipe puisse l’ouvrir depuis votre message WhatsApp.</p>
              <button type="submit" className={styles.submit} aria-busy={busy}>{busy ? 'Préparation de votre logo…' : 'Envoyer sur WhatsApp'}</button>
            </fieldset>
            <p className={styles.hint}>Le message inclut le lien de votre logo. Confirmez l’envoi dans WhatsApp.</p>
            {error && <div className={styles.error} role="alert">{error}<a href={whatsapp()}>Contacter Caractère directement</a></div>}
            {prepared && <div className={styles.ready} role="status"><strong>Votre demande est prête.</strong><p>Si WhatsApp ne s’est pas ouvert, utilisez le lien ci-dessous. Le message reste à envoyer.</p><a href={whatsapp(logoUrl)}>Ouvrir WhatsApp Caractère</a></div>}
            {file && canShare && <div className={styles.fileShare}><button type="button" disabled={busy} onClick={shareFile}>Partager aussi le fichier image ou PDF</button><p>Choisissez WhatsApp, puis Caractère au 0557 44 05 22.</p></div>}
            {shareNote && <p role="status" className={styles.hint}>{shareNote}</p>}
          </form>
          <div className={styles.reassurance}><span>Gratuit</span><span>Sans engagement</span><span>Dès 1 pièce</span></div>
        </section>
      </div>
      <footer className={styles.footer}><p>Votre logo. Nos vêtements. Votre caractère.</p><span>Aïn Benian, Alger</span></footer>
    </main>
  )
}
