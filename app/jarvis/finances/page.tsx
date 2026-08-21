'use client'
import { useEffect, useMemo, useState } from 'react'
import { adminFetch } from '@/lib/adminFetch'
import { Card, SectionTitle, Button, Input, Select, EmptyState } from '@/components/jarvis/ui'
import { startOfMonth, endOfMonth, formatDateFR } from '@/lib/jarvis-dates'
import type { JarvisTransaction } from '@/types'

const CATEGORIES = ['boutique', 'salaire', 'loyer', 'nourriture', 'transport', 'santé', 'loisirs', 'épargne', 'autre']

export default function FinancesPage() {
  const [tx, setTx] = useState<JarvisTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    adminFetch('/api/jarvis/transactions').then(r => r.ok ? r.json() : []).then(d => {
      setTx(Array.isArray(d) ? d : [])
      setLoading(false)
    })
  }
  useEffect(load, [])

  const now = new Date()
  const mStart = startOfMonth(now), mEnd = endOfMonth(now)
  const monthTx = tx.filter(t => { const d = new Date(t.date); return d >= mStart && d <= mEnd })

  const revenus = monthTx.filter(t => t.type === 'revenu').reduce((s, t) => s + Number(t.amount), 0)
  const depenses = monthTx.filter(t => t.type === 'depense').reduce((s, t) => s + Number(t.amount), 0)
  const solde = revenus - depenses

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {}
    monthTx.filter(t => t.type === 'depense').forEach(t => { map[t.category] = (map[t.category] || 0) + Number(t.amount) })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [monthTx])
  const maxCat = Math.max(1, ...byCategory.map(([, v]) => v))

  const deleteTx = async (id: string) => {
    setTx(prev => prev.filter(t => t.id !== id))
    await adminFetch(`/api/jarvis/transactions/${id}`, { method: 'DELETE' })
  }

  if (loading) return <EmptyState>Chargement des finances…</EmptyState>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Finances</div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)' }}>{now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <Card style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#34D399' }}>+{revenus.toLocaleString('fr-FR')}</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>Revenus</div>
        </Card>
        <Card style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#F87171' }}>-{depenses.toLocaleString('fr-FR')}</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>Dépenses</div>
        </Card>
        <Card style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: solde >= 0 ? '#22D3EE' : '#F87171' }}>{solde.toLocaleString('fr-FR')}</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>Solde</div>
        </Card>
      </div>

      <Button variant="ghost" onClick={() => setShowForm(v => !v)}>+ Ajouter une transaction</Button>
      {showForm && <TxForm onCreated={t => { setTx(prev => [t, ...prev]); setShowForm(false) }} />}

      {byCategory.length > 0 && (
        <Card>
          <SectionTitle>Dépenses par catégorie</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {byCategory.map(([cat, amount]) => (
              <div key={cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ textTransform: 'capitalize', color: 'rgba(255,255,255,0.7)' }}>{cat}</span>
                  <span style={{ fontWeight: 700 }}>{amount.toLocaleString('fr-FR')}</span>
                </div>
                <div style={{ height: 6, borderRadius: 20, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${(amount / maxCat) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#22D3EE,#8B5CF6)' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <SectionTitle>Historique ({monthTx.length})</SectionTitle>
        {monthTx.length === 0 ? <EmptyState>Aucune transaction ce mois-ci</EmptyState> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {monthTx.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 16 }}>{t.type === 'revenu' ? '↑' : '↓'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.description || t.category}</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{t.category} · {formatDateFR(t.date)}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.type === 'revenu' ? '#34D399' : '#F87171' }}>
                  {t.type === 'revenu' ? '+' : '-'}{Number(t.amount).toLocaleString('fr-FR')}
                </div>
                <button onClick={() => deleteTx(t.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13 }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function TxForm({ onCreated }: { onCreated: (t: JarvisTransaction) => void }) {
  const [type, setType] = useState<'revenu' | 'depense'>('depense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('autre')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    const n = Number(amount)
    if (!n || n <= 0) return
    setSaving(true)
    const res = await adminFetch('/api/jarvis/transactions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, amount: n, category, description: description || null, date }),
    })
    if (res.ok) onCreated(await res.json())
    setSaving(false)
  }

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['depense', 'revenu'] as const).map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 12.5, fontWeight: 700, textTransform: 'capitalize',
              background: type === t ? 'linear-gradient(135deg,#22D3EE,#8B5CF6)' : 'rgba(255,255,255,0.06)',
              color: type === t ? '#05070C' : 'rgba(255,255,255,0.6)',
            }}>{t}</button>
          ))}
        </div>
        <Input type="number" placeholder="Montant" value={amount} onChange={e => setAmount(e.target.value)} />
        <Select value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Input placeholder="Description (optionnel)" value={description} onChange={e => setDescription(e.target.value)} />
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <Button onClick={submit} disabled={saving}>Ajouter</Button>
      </div>
    </Card>
  )
}
