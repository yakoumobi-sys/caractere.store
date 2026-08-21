'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminFetch } from '@/lib/adminFetch'
import { Card, SectionTitle, Pill, Button, Input, EmptyState } from '@/components/jarvis/ui'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, formatTimeFR, formatDateFR } from '@/lib/jarvis-dates'
import type { JarvisTask, JarvisEvent, JarvisTransaction, JarvisGoal, JarvisProject } from '@/types'

const EVENT_ICON: Record<string, string> = {
  reunion: '👥', dejeuner: '🍽️', diner: '🍷', rdv: '📍', appel: '📞', autre: '•',
}

export default function JarvisDashboard() {
  const [tasks, setTasks] = useState<JarvisTask[]>([])
  const [events, setEvents] = useState<JarvisEvent[]>([])
  const [tx, setTx] = useState<JarvisTransaction[]>([])
  const [goals, setGoals] = useState<JarvisGoal[]>([])
  const [projects, setProjects] = useState<JarvisProject[]>([])
  const [loading, setLoading] = useState(true)
  const [quickTask, setQuickTask] = useState('')
  const [adding, setAdding] = useState(false)

  const load = () => {
    Promise.all([
      adminFetch('/api/jarvis/tasks').then(r => r.ok ? r.json() : []),
      adminFetch('/api/jarvis/events').then(r => r.ok ? r.json() : []),
      adminFetch('/api/jarvis/transactions').then(r => r.ok ? r.json() : []),
      adminFetch('/api/jarvis/goals').then(r => r.ok ? r.json() : []),
      adminFetch('/api/jarvis/projects').then(r => r.ok ? r.json() : []),
    ]).then(([t, e, x, g, p]) => {
      setTasks(Array.isArray(t) ? t : [])
      setEvents(Array.isArray(e) ? e : [])
      setTx(Array.isArray(x) ? x : [])
      setGoals(Array.isArray(g) ? g : [])
      setProjects(Array.isArray(p) ? p : [])
      setLoading(false)
    })
  }

  useEffect(load, [])

  const now = new Date()
  const dayStart = startOfDay(now), dayEnd = endOfDay(now)
  const weekStart = startOfWeek(now), weekEnd = endOfWeek(now)
  const monthStart = startOfMonth(now), monthEnd = endOfMonth(now)

  const inRange = (d: Date, a: Date, b: Date) => d >= a && d <= b

  const todayTasks = tasks.filter(t => t.status !== 'fait' && t.due_date && isSameDate(t.due_date, now))
  const overdueTasks = tasks.filter(t => t.status !== 'fait' && t.due_date && new Date(t.due_date) < dayStart)
  const weekTasksCount = tasks.filter(t => t.status !== 'fait' && t.due_date && inRange(new Date(t.due_date), weekStart, weekEnd)).length
  const monthTasksCount = tasks.filter(t => t.status !== 'fait' && t.due_date && inRange(new Date(t.due_date), monthStart, monthEnd)).length

  const todayEvents = events.filter(e => inRange(new Date(e.start_at), dayStart, dayEnd))
  const weekEvents = events.filter(e => inRange(new Date(e.start_at), weekStart, weekEnd))

  const monthTx = tx.filter(t => inRange(new Date(t.date), monthStart, monthEnd))
  const revenus = monthTx.filter(t => t.type === 'revenu').reduce((s, t) => s + Number(t.amount), 0)
  const depenses = monthTx.filter(t => t.type === 'depense').reduce((s, t) => s + Number(t.amount), 0)

  const activeGoals = goals.filter(g => g.status === 'en_cours')
  const activeProjects = projects.filter(p => p.status === 'actif')

  const toggleTask = async (t: JarvisTask) => {
    const status = t.status === 'fait' ? 'a_faire' : 'fait'
    setTasks(prev => prev.map(x => x.id === t.id ? { ...x, status } : x))
    await adminFetch(`/api/jarvis/tasks/${t.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  const addQuickTask = async () => {
    if (!quickTask.trim()) return
    setAdding(true)
    const res = await adminFetch('/api/jarvis/tasks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: quickTask.trim(), due_date: new Date().toISOString().slice(0, 10) }),
    })
    if (res.ok) {
      const created = await res.json()
      setTasks(prev => [created, ...prev])
      setQuickTask('')
    }
    setAdding(false)
  }

  if (loading) return <EmptyState>Chargement de ton tableau de bord…</EmptyState>

  const dateLabel = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3, textTransform: 'capitalize' }}>{dateLabel}</div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
          {overdueTasks.length > 0 ? `⚠ ${overdueTasks.length} tâche(s) en retard` : 'Aucune tâche en retard'}
        </div>
      </div>

      {/* Stats rapides — aujourd'hui / semaine / mois */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { label: "Aujourd'hui", value: todayTasks.length + todayEvents.length, sub: 'à traiter' },
          { label: 'Cette semaine', value: weekTasksCount + weekEvents.length, sub: 'tâches + RDV' },
          { label: 'Ce mois', value: monthTasksCount, sub: 'tâches' },
        ].map(s => (
          <Card key={s.label} style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg,#22D3EE,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Ajout rapide */}
      <Card>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            placeholder="Ajouter une tâche pour aujourd'hui…"
            value={quickTask}
            onChange={e => setQuickTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addQuickTask()}
          />
          <Button onClick={addQuickTask} disabled={adding}>+</Button>
        </div>
      </Card>

      {/* Événements du jour */}
      <Card>
        <SectionTitle action={<Link href="/jarvis/agenda" style={{ fontSize: 11, color: '#22D3EE', textDecoration: 'none' }}>Agenda →</Link>}>
          Rendez-vous aujourd'hui
        </SectionTitle>
        {todayEvents.length === 0 ? <EmptyState>Aucun rendez-vous aujourd'hui</EmptyState> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayEvents.map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 16 }}>{EVENT_ICON[e.type] || '•'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{e.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                    {formatTimeFR(e.start_at)}{e.with_person ? ` · avec ${e.with_person}` : ''}{e.location ? ` · ${e.location}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Tâches du jour */}
      <Card>
        <SectionTitle action={<Link href="/jarvis/agenda" style={{ fontSize: 11, color: '#22D3EE', textDecoration: 'none' }}>Tout voir →</Link>}>
          Tâches du jour
        </SectionTitle>
        {todayTasks.length === 0 ? <EmptyState>Rien de prévu aujourd'hui — belle journée 🎯</EmptyState> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayTasks.map(t => (
              <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                <input type="checkbox" checked={t.status === 'fait'} onChange={() => toggleTask(t)} style={{ width: 16, height: 16, accentColor: '#22D3EE' }} />
                <span style={{ flex: 1, fontSize: 13, textDecoration: t.status === 'fait' ? 'line-through' : 'none', opacity: t.status === 'fait' ? 0.4 : 1 }}>{t.title}</span>
                {t.priority === 'haute' && <Pill color="#F87171">haute</Pill>}
              </label>
            ))}
          </div>
        )}
      </Card>

      {/* Finances du mois */}
      <Card>
        <SectionTitle action={<Link href="/jarvis/finances" style={{ fontSize: 11, color: '#22D3EE', textDecoration: 'none' }}>Détail →</Link>}>
          Finances — ce mois
        </SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#34D399' }}>+{revenus.toLocaleString('fr-FR')}</div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>Revenus</div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#F87171' }}>-{depenses.toLocaleString('fr-FR')}</div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>Dépenses</div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{(revenus - depenses).toLocaleString('fr-FR')}</div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>Solde</div>
          </div>
        </div>
      </Card>

      {/* Objectifs & projets actifs */}
      <Card>
        <SectionTitle action={<Link href="/jarvis/objectifs" style={{ fontSize: 11, color: '#22D3EE', textDecoration: 'none' }}>Tout voir →</Link>}>
          Objectifs & projets actifs
        </SectionTitle>
        {activeGoals.length === 0 && activeProjects.length === 0 ? <EmptyState>Aucun objectif actif — fixe-en un dans Objectifs</EmptyState> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {activeGoals.slice(0, 3).map(g => <div key={g.id} style={{ fontSize: 12.5 }}>🎯 {g.title} — <span style={{ color: '#22D3EE' }}>{g.progress}%</span></div>)}
            {activeProjects.slice(0, 3).map(p => <div key={p.id} style={{ fontSize: 12.5 }}>📁 {p.name} — <span style={{ color: '#8B5CF6' }}>{p.progress}%</span></div>)}
          </div>
        )}
      </Card>

      {/* CTA JARVIS */}
      <Link href="/jarvis/chat" style={{ textDecoration: 'none' }}>
        <Card style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.14), rgba(139,92,246,0.14))', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>✦ Parler à JARVIS</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Résume tes mails, prépare une réponse, demande conseil</div>
          </div>
          <span style={{ fontSize: 18 }}>→</span>
        </Card>
      </Link>
    </div>
  )
}

function isSameDate(dateStr: string, ref: Date) {
  const d = new Date(dateStr.length <= 10 ? `${dateStr}T00:00:00` : dateStr)
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate()
}
