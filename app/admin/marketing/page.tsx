'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

/* ─── TYPES ─────────────────────────────────────────────────────────── */
interface Contact {
  id: string
  nom: string
  telephone: string
  email: string | null
  entreprise: string | null
  wilaya: string | null
  source: string | null
  created_at: string
  tags: string[] | null
}

/* ─── UTILS ──────────────────────────────────────────────────────────── */
function encode(msg: string) { return encodeURIComponent(msg) }
function wa(phone: string, msg: string) {
  const clean = phone.replace(/\D/g, '')
  const num = clean.startsWith('0') ? '213' + clean.slice(1) : clean.startsWith('213') ? clean : '213' + clean
  return `https://wa.me/${num}?text=${encode(msg)}`
}

/* ─── PAGE ───────────────────────────────────────────────────────────── */
export default function MarketingPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterWilaya, setFilterWilaya] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState('')
  const [tab, setTab] = useState<'contacts'|'campagne'|'stats'>('contacts')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(0)

  useEffect(() => {
    fetch('/api/admin/contacts')
      .then(r => r.json())
      .then(d => { setContacts(d.contacts || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  /* Filtres */
  const filtered = contacts.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.nom.toLowerCase().includes(q) || c.telephone.includes(q) || (c.entreprise || '').toLowerCase().includes(q)
    const wilayas = Array.from(new Set(contacts.map(c => c.wilaya).filter(Boolean))) as string[]
const sources = Array.from(new Set(contacts.map(c => c.source).filter(Boolean))) as string[]
    return matchSearch && matchWilaya && matchSource
  })

  const wilayas = [...new Set(contacts.map(c => c.wilaya).filter(Boolean))] as string[]
  const sources = [...new Set(contacts.map(c => c.source).filter(Boolean))] as string[]

  /* Sélection */
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map(c => c.id)))
  }
  const toggle = (id: string) => {
    const s = new Set(selected)
    s.has(id) ? s.delete(id) : s.add(id)
    setSelected(s)
  }

  /* Message templates */
  const TEMPLATES = [
    {
      label: '🎁 Promo',
      msg: `Bonjour {{NOM}} 👋\n\nCaractère Store vous offre -10% sur votre prochaine commande ! 🎉\n\nUtilisez le code PROMO10 sur mycaractere.xyz\n\nOffre valable jusqu'au 31 décembre. ⏰`,
    },
    {
      label: '🚀 Nouveau produit',
      msg: `Bonjour {{NOM}} 👋\n\nNouveau chez Caractère Store : notre collection Les Fennecs World Cup 2026 est disponible ! 🇩🇿⚽\n\nCommandez sur mycaractere.xyz/collection\n\nStock limité !`,
    },
    {
      label: '📦 Suivi commande',
      msg: `Bonjour {{NOM}} 👋\n\nVotre commande Caractère Store est en cours de préparation. 📦\n\nNous vous contactons dès qu'elle est prête pour expédition.\n\nMerci de votre confiance ! 🙏`,
    },
    {
      label: '⭐ Avis client',
      msg: `Bonjour {{NOM}} 👋\n\nVous avez récemment reçu votre commande Caractère Store. 🎉\n\nVotre avis nous aide à nous améliorer — pouvez-vous nous laisser 2 minutes de feedback ?\n\nRépondez à ce message, nous adorons vos retours ! 💬`,
    },
    {
      label: '🏢 B2B',
      msg: `Bonjour {{NOM}} 👋\n\nCaractère Store habille les équipes professionnelles en Algérie.\n\nT-shirts, polos, gilets, uniformes — à partir de 1 pièce, livraison nationale. 🚚\n\nDemandez votre devis gratuit sur mycaractere.xyz ou répondez à ce message. 📞`,
    },
  ]

  /* Envoi WhatsApp un par un */
  const handleSendWhatsApp = async () => {
    if (!message.trim()) return alert('Écrivez un message.')
    if (selected.size === 0) return alert('Sélectionnez au moins 1 contact.')
    setSending(true)
    setSent(0)
    const selectedContacts = contacts.filter(c => selected.has(c.id))
    for (let i = 0; i < selectedContacts.length; i++) {
      const c = selectedContacts[i]
      const msg = message.replace(/{{NOM}}/g, c.nom.split(' ')[0])
      window.open(wa(c.telephone, msg), '_blank')
      setSent(i + 1)
      if (i < selectedContacts.length - 1) await new Promise(r => setTimeout(r, 1500))
    }
    setSending(false)
    alert(`✅ ${selectedContacts.length} messages WhatsApp ouverts.`)
  }

  /* Export CSV */
  const handleExport = () => {
    const rows = [
      ['Nom', 'Téléphone', 'Email', 'Entreprise', 'Wilaya', 'Source', 'Date'],
      ...filtered.map(c => [c.nom, c.telephone, c.email || '', c.entreprise || '', c.wilaya || '', c.source || '', new Date(c.created_at).toLocaleDateString('fr-FR')]),
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'contacts-caractere.csv'; a.click()
  }

  const ST = {
    page: { background: '#F8FAFC', minHeight: '100vh', padding: '0 0 40px' } as React.CSSProperties,
    header: { background: '#1E293B', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
    tab: (active: boolean) => ({
      padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none',
      background: active ? '#3B82F6' : 'transparent', color: active ? '#fff' : '#94A3B8',
    } as React.CSSProperties),
    card: { background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,.07)', marginBottom: 12 } as React.CSSProperties,
    input: { width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '10px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const },
    btn: (color: string) => ({ padding: '11px 20px', borderRadius: 10, background: color, color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%' } as React.CSSProperties),
  }

  return (
    <div style={ST.page}>
      {/* Header */}
      <div style={ST.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 13 }}>← Admin</Link>
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>📣 Marketing</span>
        </div>
        <div style={{ color: '#64748B', fontSize: 12 }}>{contacts.length} contacts</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '12px 16px', background: '#1E293B', borderTop: '1px solid #334155' }}>
        {(['contacts', 'campagne', 'stats'] as const).map(t => (
          <button key={t} style={ST.tab(tab === t)} onClick={() => setTab(t)}>
            {t === 'contacts' ? '👥 Contacts' : t === 'campagne' ? '📨 Campagne' : '📊 Stats'}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>

        {/* ── TAB CONTACTS ─────────────────────────────────────────── */}
        {tab === 'contacts' && (
          <>
            {/* Filtres */}
            <div style={ST.card}>
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input style={ST.input} placeholder="🔍 Rechercher nom, tél, entreprise..." value={search} onChange={e => setSearch(e.target.value)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <select style={{ ...ST.input, color: filterWilaya ? '#1E293B' : '#94A3B8' }} value={filterWilaya} onChange={e => setFilterWilaya(e.target.value)}>
                    <option value="">Toutes wilayas</option>
                    {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  <select style={{ ...ST.input, color: filterSource ? '#1E293B' : '#94A3B8' }} value={filterSource} onChange={e => setFilterSource(e.target.value)}>
                    <option value="">Toutes sources</option>
                    {sources.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ ...ST.btn('#1E293B'), flex: 1 }} onClick={toggleAll}>
                    {selected.size === filtered.length && filtered.length > 0 ? '☑ Tout désélect.' : '☐ Tout sélect.'} ({filtered.length})
                  </button>
                  <button style={{ ...ST.btn('#10B981'), flex: 1 }} onClick={handleExport}>
                    ⬇ CSV
                  </button>
                </div>
                {selected.size > 0 && (
                  <div style={{ background: '#EFF6FF', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#3B82F6', fontWeight: 700 }}>
                    {selected.size} contact{selected.size > 1 ? 's' : ''} sélectionné{selected.size > 1 ? 's' : ''}
                    <button onClick={() => setTab('campagne')} style={{ marginLeft: 10, background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 6, padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>
                      Envoyer →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Liste contacts */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 13 }}>Chargement...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 13 }}>Aucun contact trouvé</div>
            ) : (
              <div style={ST.card}>
                {filtered.map((c, i) => (
                  <div key={c.id} onClick={() => toggle(c.id)} style={{
                    padding: '12px 14px', borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none',
                    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                    background: selected.has(c.id) ? '#EFF6FF' : '#fff',
                    transition: 'background 0.15s',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 6, border: `2px solid ${selected.has(c.id) ? '#3B82F6' : '#CBD5E1'}`,
                      background: selected.has(c.id) ? '#3B82F6' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {selected.has(c.id) && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{c.nom}</div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{c.telephone}</div>
                      {c.entreprise && <div style={{ fontSize: 11, color: '#94A3B8' }}>{c.entreprise}</div>}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {c.wilaya && <div style={{ fontSize: 11, color: '#64748B', marginBottom: 2 }}>{c.wilaya}</div>}
                      <span style={{ fontSize: 10, background: '#F1F5F9', color: '#64748B', padding: '2px 6px', borderRadius: 20, fontWeight: 600 }}>
                        {c.source || 'Site'}
                      </span>
                    </div>
                    <a href={wa(c.telephone, `Bonjour ${c.nom.split(' ')[0]} 👋`)} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ padding: '6px 10px', background: '#25D366', color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
                      WA
                    </a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── TAB CAMPAGNE ──────────────────────────────────────────── */}
        {tab === 'campagne' && (
          <>
            {/* Résumé sélection */}
            <div style={{ ...ST.card, padding: '14px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
                Destinataires : {selected.size > 0 ? `${selected.size} contact${selected.size > 1 ? 's' : ''} sélectionné${selected.size > 1 ? 's' : ''}` : 'Aucun sélectionné'}
              </div>
              {selected.size === 0 && (
                <button style={{ ...ST.btn('#64748B') }} onClick={() => { setSelected(new Set(filtered.map(c => c.id))); }}>
                  Sélectionner tous les contacts filtrés ({filtered.length})
                </button>
              )}
            </div>

            {/* Templates */}
            <div style={{ ...ST.card, padding: '14px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Templates rapides
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {TEMPLATES.map(t => (
                  <button key={t.label} onClick={() => setMessage(t.msg)}
                    style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: message === t.msg ? '#EFF6FF' : '#fff', color: '#1E293B', fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                    {t.label}
                    <span style={{ display: 'block', fontSize: 11, color: '#94A3B8', fontWeight: 400, marginTop: 2 }}>
                      {t.msg.slice(0, 60)}...
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Éditeur message */}
            <div style={{ ...ST.card, padding: '14px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Message ({{NOM}} = prénom auto)
              </div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Bonjour {{NOM}} 👋&#10;&#10;Votre message ici..."
                rows={8}
                style={{ ...ST.input, resize: 'none', lineHeight: 1.6 }}
              />
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 6 }}>
                {message.length} caractères · {{NOM}} sera remplacé par le prénom
              </div>
            </div>

            {/* Aperçu */}
            {message && contacts.length > 0 && (
              <div style={{ ...ST.card, padding: '14px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase' }}>Aperçu</div>
                <div style={{ background: '#F0FDF4', borderRadius: 10, padding: 12, fontSize: 13, color: '#1E293B', whiteSpace: 'pre-wrap', lineHeight: 1.6, border: '1px solid #BBF7D0' }}>
                  {message.replace(/{{NOM}}/g, contacts[0]?.nom?.split(' ')[0] || 'Client')}
                </div>
              </div>
            )}

            {/* Boutons envoi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button style={{ ...ST.btn('#25D366'), fontSize: 15, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onClick={handleSendWhatsApp} disabled={sending}>
                {sending ? `⏳ Envoi ${sent}/${selected.size}...` : `💬 Envoyer WhatsApp (${selected.size} contacts)`}
              </button>
              <div style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>
                Chaque message s'ouvre dans WhatsApp. Confirmez l'envoi manuellement pour chaque contact.
              </div>
            </div>
          </>
        )}

        {/* ── TAB STATS ────────────────────────────────────────────── */}
        {tab === 'stats' && (
          <>
            {/* Total */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              {[
                { label: 'Total contacts', value: contacts.length, color: '#3B82F6' },
                { label: 'Avec email', value: contacts.filter(c => c.email).length, color: '#8B5CF6' },
                { label: 'Avec entreprise', value: contacts.filter(c => c.entreprise).length, color: '#F97316' },
                { label: 'Ce mois', value: contacts.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length, color: '#10B981' },
              ].map(s => (
                <div key={s.label} style={{ ...ST.card, padding: '14px 16px', margin: 0 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Par wilaya */}
            <div style={ST.card}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9', fontSize: 13, fontWeight: 700, color: '#1E293B' }}>Par wilaya</div>
              {wilayas.slice(0, 10).map(w => {
                const count = contacts.filter(c => c.wilaya === w).length
                const pct = Math.round(count / contacts.length * 100)
                return (
                  <div key={w} style={{ padding: '10px 14px', borderBottom: '1px solid #F8FAFC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: '#1E293B' }}>{w}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#3B82F6' }}>{count}</span>
                    </div>
                    <div style={{ height: 4, background: '#F1F5F9', borderRadius: 2 }}>
                      <div style={{ height: 4, width: `${pct}%`, background: '#3B82F6', borderRadius: 2 }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Par source */}
            <div style={ST.card}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9', fontSize: 13, fontWeight: 700, color: '#1E293B' }}>Par source</div>
              {sources.map(s => {
                const count = contacts.filter(c => c.source === s).length
                return (
                  <div key={s} style={{ padding: '10px 14px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: '#1E293B' }}>{s}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>{count}</span>
                  </div>
                )
              })}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
