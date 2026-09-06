'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

/* Palette de la landing — bleu nuit + or, cohérente avec l'identité Caractère. */
const C = {
  navy: '#0A1B2E',
  navyDeep: '#06121F',
  card: '#0E2438',
  border: 'rgba(56,189,248,0.22)',
  sky: '#38BDF8',
  gold: '#E8B923',
  goldLight: '#F5D264',
  muted: '#93B4CC',
  white: '#F8FAFC',
}

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png'
const WHATSAPP = 'https://wa.me/213557440522'

const DOMAINES = [
  { value: 'entreprise', label: 'Entreprise / شركة' },
  { value: 'ecole', label: 'École / مدرسة' },
  { value: 'club', label: 'Club sportif / نادي رياضي' },
  { value: 'association', label: 'Association / جمعية' },
  { value: 'restaurant', label: 'Restaurant / مطعم' },
  { value: 'evenement', label: 'Événement / مناسبة' },
  { value: 'particulier', label: 'Particulier / خاص' },
  { value: 'autre', label: 'Autre / آخر' },
]

const ACCEPTED = '.png,.jpg,.jpeg,.webp,.pdf,.ai,.eps'
const MAX_FILE_MB = 10

/* Icônes inline : pas de dépendance externe, elles héritent de la couleur du parent. */
const Icon = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
    </svg>
  ),
  note: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5M12 3v12" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  printer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  badge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" /><path d="m8.21 13.89-1.2 7.11L12 18.5l4.99 2.5-1.2-7.11" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.2A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 21 11.5z" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>
  ),
}

const AVANTAGES = [
  { icon: Icon.truck, ar: 'تسليم سريع', fr: 'Livraison rapide', subAr: 'في الوقت المتفق عليه', subFr: '58 wilayas — délai respecté' },
  { icon: Icon.printer, ar: 'طباعة احترافية', fr: 'Impression pro', subAr: 'تقنيات حديثة وجودة عالية', subFr: 'DTF, sérigraphie, broderie' },
  { icon: Icon.pen, ar: 'تصميم مخصص', fr: 'Design sur mesure', subAr: 'حسب طلبك وهويتك', subFr: 'Adapté à votre identité' },
]

type Status = 'idle' | 'sending' | 'done' | 'error'

export default function DevisExpressClient() {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [logoBroken, setLogoBroken] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const pickFile = (f: File | null) => {
    setFileError(null)
    if (!f) { setFile(null); return }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`الملف كبير جدا (${MAX_FILE_MB} Mo max) / Fichier trop lourd`)
      setFile(null)
      return
    }
    setFile(f)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setErrorMsg(null)

    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd) as Record<string, string>

    try {
      // Le fichier part d'abord vers le stockage : l'e-mail ne transporte qu'une URL.
      let logoUrl: string | null = null
      if (file) {
        const upload = new FormData()
        upload.append('file', file)
        const res = await fetch('/api/upload-logo', { method: 'POST', body: upload })
        if (res.ok) {
          const json = await res.json()
          logoUrl = json.url ?? null
        }
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'Landing devis express',
          nom: data.nom,
          telephone: data.telephone,
          domaine: data.domaine,
          quantite: data.quantite,
          details: data.details,
          logo: logoUrl ?? (file ? `${file.name} (upload échoué)` : 'aucun'),
          newsletter: data.newsletter === 'on' ? 'oui' : 'non',
        }),
      })
      if (!res.ok) throw new Error(res.status === 429 ? 'rate' : 'server')

      setStatus('done')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        (err as Error).message === 'rate'
          ? 'محاولات كثيرة، أعد المحاولة لاحقا / Trop de demandes, réessayez plus tard.'
          : 'حدث خطأ، تواصل معنا عبر واتساب / Une erreur est survenue, contactez-nous sur WhatsApp.'
      )
    }
  }

  return (
    <div className="dvx" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <main className="dvx-shell">
        {/* ── En-tête ───────────────────────────────────────────────── */}
        <header className="dvx-head">
          <Link href="/" aria-label="Caractère Store — accueil">
            {logoBroken ? (
              <span className="dvx-wordmark">CARACTÈRE</span>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={LOGO}
                alt="Caractère Store"
                className="dvx-logo"
                onError={() => setLogoBroken(true)}
              />
            )}
          </Link>

          <span className="dvx-badge">
            <i className="dvx-bolt">{Icon.bolt}</i>
            خدمة سريعة — تصميم وطباعة مضمونة
          </span>

          <h1 className="dvx-h1">احصل على عرض سعر في دقائق</h1>
          <p className="dvx-sub">
            أدخل معلوماتك وسنتواصل معك لتأكيد السعر والتفاصيل.
            <span className="dvx-sub-fr">Recevez votre devis personnalisé en quelques minutes.</span>
          </p>

          <ul className="dvx-trust">
            <li><i>{Icon.truck}</i> توصيل متاح</li>
            <li><i>{Icon.badge}</i> جودة عالية</li>
            <li><i>{Icon.chat}</i> رد سريع</li>
          </ul>
        </header>

        {/* ── Formulaire ────────────────────────────────────────────── */}
        <section className="dvx-card" aria-labelledby="dvx-form-title">
          <h2 id="dvx-form-title" className="dvx-sr">Formulaire de demande de devis</h2>

          {status === 'done' ? (
            <div className="dvx-success" role="status">
              <div className="dvx-check">✓</div>
              <p className="dvx-success-ar">تم إرسال طلبك بنجاح</p>
              <p className="dvx-success-fr">Demande envoyée — nous vous répondons sous 24 h.</p>
              <a className="dvx-wa" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                تواصل الآن على واتساب
                <small dir="ltr">Discuter sur WhatsApp</small>
              </a>
              <button
                type="button"
                className="dvx-again"
                onClick={() => { setStatus('idle'); setFile(null); formRef.current?.reset() }}
              >
                إرسال طلب آخر — Nouvelle demande
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate={false}>
              <div className="dvx-field">
                <label className="dvx-label" htmlFor="dvx-nom">
                  <i>{Icon.user}</i><b>الاسم</b> / Nom <em>*</em>
                </label>
                <input id="dvx-nom" name="nom" type="text" required maxLength={80}
                  autoComplete="name" placeholder="الاسم الكامل" className="dvx-input" dir="auto" />
              </div>

              <div className="dvx-field">
                <label className="dvx-label" htmlFor="dvx-tel">
                  <i>{Icon.phone}</i><b>رقم الهاتف</b> / Téléphone <em>*</em>
                </label>
                <input id="dvx-tel" name="telephone" type="tel" required
                  inputMode="tel" autoComplete="tel" pattern="[0-9 +]{9,15}"
                  placeholder="0557 44 05 22" className="dvx-input" dir="ltr" />
              </div>

              <div className="dvx-row">
                <div className="dvx-field">
                  <label className="dvx-label" htmlFor="dvx-domaine">
                    <i>{Icon.briefcase}</i><b>المجال</b> / Domaine <em>*</em>
                  </label>
                  <select id="dvx-domaine" name="domaine" required defaultValue="" className="dvx-input dvx-select">
                    <option value="" disabled>اختر المجال…</option>
                    {DOMAINES.map(d => <option key={d.value} value={d.label}>{d.label}</option>)}
                  </select>
                </div>

                <div className="dvx-field">
                  <label className="dvx-label" htmlFor="dvx-qte">
                    <i>{Icon.box}</i><b>الكمية</b> / Quantité <em>*</em>
                  </label>
                  <input id="dvx-qte" name="quantite" type="number" required min={1} max={100000}
                    inputMode="numeric" placeholder="15" className="dvx-input" dir="ltr" />
                </div>
              </div>

              <div className="dvx-row">
                <div className="dvx-field">
                  <label className="dvx-label" htmlFor="dvx-file">
                    <i>{Icon.image}</i><b>الشعار أو الصورة</b> / Logo ou image
                  </label>
                  <label
                    htmlFor="dvx-file"
                    className={`dvx-drop${file ? ' is-filled' : ''}${dragging ? ' is-dragging' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); pickFile(e.dataTransfer.files?.[0] ?? null) }}
                  >
                    <i className="dvx-drop-icon">{Icon.upload}</i>
                    <span className="dvx-drop-text" dir={file ? 'ltr' : 'rtl'}>
                      {file ? `${file.name} ✓` : 'أضف ملفك هنا'}
                    </span>
                    <input
                      ref={fileInput}
                      id="dvx-file"
                      type="file"
                      accept={ACCEPTED}
                      className="dvx-sr"
                      onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <span className={`dvx-hint${fileError ? ' is-error' : ''}`}>
                    {fileError ?? `PNG, JPG, PDF, AI, EPS — ${MAX_FILE_MB} Mo max`}
                  </span>
                </div>

                <div className="dvx-field">
                  <label className="dvx-label" htmlFor="dvx-details">
                    <i>{Icon.note}</i><b>تفاصيل أخرى</b> / Autres détails
                  </label>
                  <textarea id="dvx-details" name="details" rows={5} maxLength={1000}
                    placeholder="المقاسات، الألوان، الأجل…" className="dvx-input dvx-textarea" dir="auto" />
                </div>
              </div>

              <label className="dvx-consent">
                <input type="checkbox" name="newsletter" defaultChecked />
                <span>أوافق على استقبال تحديثات كاراكتير والعروض الخاصة</span>
              </label>

              <button type="submit" className="dvx-submit" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <><span className="dvx-spinner" aria-hidden="true" /><span dir="ltr">Envoi…</span></>
                ) : (
                  <span className="dvx-submit-labels">
                    احصل على السعر
                    <small dir="ltr">Obtenir mon prix</small>
                  </span>
                )}
              </button>

              {status === 'error' && errorMsg && (
                <p className="dvx-error" role="alert">{errorMsg}</p>
              )}

              <p className="dvx-secure">
                <i>{Icon.shield}</i> معلوماتك آمنة ولن يتم مشاركتها
              </p>
            </form>
          )}
        </section>

        {/* ── Réassurance ───────────────────────────────────────────── */}
        <section className="dvx-perks" aria-label="Nos garanties">
          {AVANTAGES.map((a) => (
            <article key={a.ar} className="dvx-perk">
              <i className="dvx-perk-icon">{a.icon}</i>
              <h3>{a.ar}</h3>
              <p className="dvx-perk-ar">{a.subAr}</p>
              <p className="dvx-perk-fr">{a.fr} — {a.subFr}</p>
            </article>
          ))}
        </section>

        <footer className="dvx-foot">
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp 0557 44 05 22</a>
          <span>·</span>
          <Link href="/">caracteredz.com</Link>
        </footer>
      </main>
    </div>
  )
}

/* Styles scopés sous .dvx : la landing ne touche pas au reste du site. */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');

.dvx {
  --navy: ${C.navy};
  --navy-deep: ${C.navyDeep};
  --card: ${C.card};
  --border: ${C.border};
  --sky: ${C.sky};
  --gold: ${C.gold};
  --gold-light: ${C.goldLight};
  --muted: ${C.muted};
  --white: ${C.white};
  font-family: 'Cairo', var(--font-inter), system-ui, sans-serif;
  color: var(--white);
  min-height: 100vh;
  background:
    radial-gradient(900px 520px at 50% -8%, rgba(56,189,248,.20), transparent 62%),
    radial-gradient(700px 460px at 50% 108%, rgba(232,185,35,.10), transparent 60%),
    linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
}
.dvx * { box-sizing: border-box; }
.dvx-shell { max-width: 620px; margin: 0 auto; padding: 40px 20px 64px; }

.dvx-sr {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

/* ---------- En-tête ---------- */
.dvx-head { text-align: center; }
.dvx-logo { height: 62px; width: auto; margin: 0 auto 26px; display: block; }
.dvx-wordmark {
  display: block; direction: ltr; margin-bottom: 26px;
  font-size: 26px; font-weight: 900; letter-spacing: 6px; color: var(--white);
}

.dvx-badge {
  display: inline-flex; align-items: center; gap: 9px;
  border: 1.5px solid rgba(232,185,35,.55);
  background: rgba(232,185,35,.08);
  color: var(--gold-light);
  padding: 9px 20px; border-radius: 999px;
  font-size: 14px; font-weight: 700; line-height: 1.4;
}
.dvx-bolt { width: 16px; height: 16px; color: var(--gold); display: inline-flex; flex: 0 0 auto; }
.dvx-bolt svg { width: 100%; height: 100%; }

.dvx-h1 {
  margin: 24px 0 12px;
  font-size: clamp(30px, 8vw, 44px);
  font-weight: 900; line-height: 1.25;
  color: var(--gold);
  text-shadow: 0 0 34px rgba(232,185,35,.28);
}
.dvx-sub { color: #C9DDEC; font-size: 16px; line-height: 1.7; }
.dvx-sub-fr { display: block; direction: ltr; color: var(--muted); font-size: 14px; margin-top: 4px; }

.dvx-trust {
  list-style: none; padding: 0;
  display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 22px;
  margin: 22px 0 34px;
  font-size: 15px; font-weight: 700; color: #DCEBF7;
}
.dvx-trust li { display: inline-flex; align-items: center; gap: 8px; }
.dvx-trust i { width: 19px; height: 19px; color: var(--sky); display: inline-flex; }
.dvx-trust i svg { width: 100%; height: 100%; }

/* ---------- Carte formulaire ---------- */
.dvx-card {
  background: linear-gradient(160deg, rgba(20,48,74,.92), rgba(9,26,43,.92));
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 26px 22px 28px;
  box-shadow: 0 26px 60px -24px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.06);
}
.dvx-card form { display: flex; flex-direction: column; gap: 18px; }

.dvx-field { display: flex; flex-direction: column; gap: 9px; min-width: 0; }
.dvx-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.dvx-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 700; color: #DCEBF7;
}
.dvx-label b { font-weight: 700; }
.dvx-label em { color: #FB923C; font-style: normal; font-weight: 900; }
.dvx-label i { width: 20px; height: 20px; color: var(--sky); flex: 0 0 auto; display: inline-flex; }
.dvx-label i svg { width: 100%; height: 100%; }

.dvx-input {
  width: 100%;
  background: #fff; color: #0F172A;
  border: 1px solid rgba(255,255,255,.9);
  border-radius: 12px;
  padding: 14px 16px;
  font-family: inherit; font-size: 16px; font-weight: 600;
  transition: box-shadow .2s, border-color .2s;
}
.dvx-input::placeholder { color: #94A3B8; font-weight: 500; }
.dvx-input:focus {
  outline: none;
  border-color: var(--sky);
  box-shadow: 0 0 0 3px rgba(56,189,248,.35);
}
.dvx-input:user-invalid { border-color: #F87171; }
.dvx-select { appearance: none; cursor: pointer; }
.dvx-textarea { resize: vertical; min-height: 132px; line-height: 1.6; }

/* Zone de dépôt du logo */
.dvx-drop {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
  min-height: 132px; padding: 16px 12px;
  border: 2px dashed rgba(56,189,248,.45);
  border-radius: 14px;
  background: rgba(56,189,248,.06);
  cursor: pointer; text-align: center;
  transition: border-color .2s, background .2s, transform .2s;
}
.dvx-drop:hover, .dvx-drop.is-dragging { border-color: var(--sky); background: rgba(56,189,248,.13); }
.dvx-drop.is-filled { border-color: #4ADE80; background: rgba(74,222,128,.10); }
.dvx-drop-icon { width: 34px; height: 34px; color: var(--sky); display: inline-flex; }
.dvx-drop.is-filled .dvx-drop-icon { color: #4ADE80; }
.dvx-drop-icon svg { width: 100%; height: 100%; }
.dvx-drop-text {
  font-size: 14px; font-weight: 700; color: #DCEBF7;
  word-break: break-word; max-width: 100%;
}
.dvx-hint { direction: ltr; font-size: 12px; font-weight: 600; color: var(--muted); text-align: center; }
.dvx-hint.is-error { color: #FCA5A5; }

/* Consentement + envoi */
.dvx-consent {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 14px; font-weight: 600; color: #DCEBF7; line-height: 1.5;
  cursor: pointer; margin-top: 4px;
}
.dvx-consent input {
  width: 20px; height: 20px; flex: 0 0 auto; margin-top: 1px;
  accent-color: var(--sky); cursor: pointer;
}

.dvx-submit {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 18px 24px;
  border: none; border-radius: 999px;
  background: linear-gradient(180deg, var(--gold-light), var(--gold));
  color: #22190A;
  font-family: inherit; font-size: 18px; font-weight: 900;
  cursor: pointer;
  box-shadow: 0 14px 34px -12px rgba(232,185,35,.6);
  transition: transform .2s, box-shadow .3s, filter .2s;
}
.dvx-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 18px 42px -12px rgba(232,185,35,.72); }
.dvx-submit:disabled { cursor: not-allowed; filter: saturate(.7); }
.dvx-spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2.5px solid rgba(34,25,10,.3); border-top-color: #22190A;
  animation: dvx-spin .7s linear infinite;
}
@keyframes dvx-spin { to { transform: rotate(360deg); } }
.dvx-submit-labels { display: flex; flex-direction: column; align-items: center; line-height: 1.25; }
.dvx-submit-labels small { font-size: 13px; font-weight: 700; opacity: .72; }

.dvx-error {
  font-size: 14px; font-weight: 700; color: #FCA5A5; text-align: center;
}
.dvx-secure {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 13px; font-weight: 600; color: var(--muted);
}
.dvx-secure i { width: 16px; height: 16px; color: var(--sky); display: inline-flex; }
.dvx-secure i svg { width: 100%; height: 100%; }

/* ---------- Confirmation ---------- */
.dvx-success { text-align: center; padding: 22px 4px; }
.dvx-check {
  width: 68px; height: 68px; margin: 0 auto 18px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%; background: rgba(74,222,128,.14);
  border: 2px solid #4ADE80; color: #4ADE80;
  font-size: 34px; font-weight: 900;
}
.dvx-success-ar { font-size: 22px; font-weight: 900; color: var(--gold); margin-bottom: 6px; }
.dvx-success-fr { direction: ltr; font-size: 15px; color: var(--muted); margin-bottom: 24px; }
.dvx-wa {
  display: flex; flex-direction: column; align-items: center;
  padding: 14px 22px; border-radius: 999px; line-height: 1.25;
  background: #25D366; color: #062514;
  font-size: 17px; font-weight: 900; text-decoration: none;
}
.dvx-wa small { font-size: 13px; font-weight: 700; opacity: .72; }
.dvx-again {
  margin-top: 14px; background: none; border: none;
  color: var(--muted); font-family: inherit; font-size: 14px; font-weight: 700;
  text-decoration: underline; cursor: pointer;
}

/* ---------- Réassurance ---------- */
.dvx-perks { display: flex; flex-direction: column; gap: 16px; margin-top: 26px; }
.dvx-perk {
  background: rgba(14,36,56,.72);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 26px 20px; text-align: center;
}
.dvx-perk-icon { width: 34px; height: 34px; color: var(--sky); display: inline-flex; margin-bottom: 12px; }
.dvx-perk-icon svg { width: 100%; height: 100%; }
.dvx-perk h3 { font-size: 21px; font-weight: 900; margin-bottom: 6px; }
.dvx-perk-ar { font-size: 15px; color: var(--muted); }
.dvx-perk-fr { direction: ltr; font-size: 13px; color: #6E93AD; margin-top: 4px; }

.dvx-foot {
  display: flex; justify-content: center; align-items: center; gap: 10px;
  margin-top: 30px; direction: ltr;
  font-size: 13px; font-weight: 600; color: var(--muted);
}
.dvx-foot a { color: var(--muted); text-decoration: none; }
.dvx-foot a:hover { color: var(--sky); }

@media (max-width: 480px) {
  .dvx-shell { padding: 28px 16px 52px; }
  .dvx-row { gap: 12px; }
  .dvx-label { font-size: 14px; gap: 6px; }
  .dvx-input { padding: 13px 14px; font-size: 15px; }
}
@media (max-width: 359px) {
  .dvx-row { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .dvx-submit, .dvx-drop { transition: none; }
  .dvx-spinner { animation-duration: 2s; }
}
`
