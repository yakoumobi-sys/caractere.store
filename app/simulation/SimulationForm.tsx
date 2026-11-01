'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from './simulation.module.css'

const NUMBER = '213557440522'
const MAX_BYTES = 4 * 1024 * 1024
const TYPES = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']

export default function SimulationForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [product, setProduct] = useState('Polo')
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
    if (next.type.startsWith('image/')) {
      const nextReader = new FileReader()
      reader.current = nextReader
      nextReader.onload = () => setPreview(String(nextReader.result))
      nextReader.readAsDataURL(next)
    }
  }

  function message(url: string) {
    return `Bonjour Caractère, je souhaite une simulation gratuite avec mon logo.\nArticle : ${product}\n${quantity ? `Quantité : ${quantity}\n` : ''}Mon logo : ${url}`
  }
  function whatsapp(url: string) {
    return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message(url))}`
  }

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (requestLock.current) return
    if (!file) { setError('Ajoutez votre logo pour demander votre simulation.'); input.current?.focus(); return }
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
      window.location.assign(whatsapp(url))
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== 'AbortError' && cause.name !== 'TypeError' ? cause.message : 'Connexion interrompue. Votre logo est toujours ici : réessayez ou contactez-nous directement.')
    } finally { requestLock.current = false; setBusy(false) }
  }

  async function shareFile() {
    if (!file) return
    setShareNote('')
    try {
      await navigator.share({ files: [file], title: 'Simulation gratuite Caractère', text: `Bonjour Caractère, voici mon logo pour une simulation gratuite sur ${product.toLowerCase()}.` })
      setShareNote('Vérifiez l’envoi dans votre conversation WhatsApp avec Caractère.')
    } catch (cause) {
      if (!(cause instanceof Error && cause.name === 'AbortError')) setShareNote('Le partage est indisponible ici. Utilisez le bouton WhatsApp : le lien de votre logo sera inclus.')
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Caractère, accueil">Caractère<span>®</span></Link>
        <Link href="/produits" className={styles.catalogue}>Voir les vêtements <span aria-hidden="true">↗</span></Link>
      </header>
      <div className={styles.layout}>
        <section className={styles.intro}>
          <p className={styles.badge}><span aria-hidden="true" />Simulation gratuite</p>
          <h1>Votre logo mérite<br />du caractère.</h1>
          <p className={styles.lead}>Voyez votre logo sur nos vêtements<br className={styles.desktopBreak} /> avant de commander.</p>
          <div className={styles.productStage}>
            <img src="/home-cutouts/polo.png" alt="Polo Caractère à personnaliser avec votre logo" className={styles.polo} />
            <div className={styles.logoCard}>
              {preview ? <img src={preview} alt="Votre logo sélectionné" /> : <span>{file ? 'Votre logo PDF' : 'Votre logo ici'}</span>}
              <small>{file ? 'Logo sélectionné' : 'Et si on essayait ?'}</small>
            </div>
            <p className={styles.stageCaption}>La simulation sera préparée par notre équipe.</p>
          </div>
        </section>
        <section className={styles.formPanel} aria-labelledby="form-title">
          <h2 id="form-title">On commence par votre logo.</h2>
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
                <label>Sur quel article ?<select value={product} onChange={event => setProduct(event.target.value)}>{['Polo', 'T-shirt', 'Gilet', 'Casquette', 'Hoodie', 'Tablier', 'Tote bag', 'Autre / À conseiller'].map(item => <option key={item}>{item}</option>)}</select></label>
                <label>Quantité <span>(facultatif)</span><input type="number" min="1" max="100000" step="1" inputMode="numeric" placeholder="Ex. 20" value={quantity} onChange={event => setQuantity(event.target.value)} /></label>
              </div>
              <p className={styles.privacy}>En continuant, votre logo sera chargé pour que notre équipe puisse l’ouvrir depuis votre message WhatsApp.</p>
              <button type="submit" className={styles.submit} aria-busy={busy}>{busy ? 'Préparation de votre logo…' : 'Envoyer sur WhatsApp'}<span aria-hidden="true">↗</span></button>
            </fieldset>
            <p className={styles.hint}>Le message inclut le lien de votre logo. Confirmez l’envoi dans WhatsApp.</p>
            {error && <div className={styles.error} role="alert">{error}<a href={`https://wa.me/${NUMBER}?text=${encodeURIComponent('Bonjour, je souhaite une simulation gratuite. Je vais joindre mon logo ici.')}`}>Contacter Caractère directement</a></div>}
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
