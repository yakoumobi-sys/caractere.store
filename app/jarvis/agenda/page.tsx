'use client'
import { useEffect, useMemo, useState } from 'react'
import { adminFetch } from '@/lib/adminFetch'
import { Card, SectionTitle, Pill, Button, Input, Select, EmptyState } from '@/components/jarvis/ui'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, formatTimeFR, formatDateFR } from '@/lib/jarvis-dates'
import type { JarvisTask, JarvisEvent } from '@/types'

const EVENT_ICON: Record<string, string> = { reunion: '👥', dejeuner: '🍽️', diner: '🍷', rdv: '📍', appel: '📞', autre: '•' }
const EVENT_LABEL: Record<string, string> = { reunion: 'Réunion', dejeuner: 'Déjeuner', diner: 'Dîner', rdv: 'Rendez-vous', appel: 'Appel', autre: 'Autre' }

type Range = 'jour' | 'semaine' | 'mois'

export default function AgendaPage() {
  const [tasks, setTasks] = useState<JarvisTask[]>([])
  const [events, setEvents] = useState<JarvisEvent[]>([])
  const [range, setRange] = useState<Range>('jour')
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)

  const load = () => {
    Promise.all([
      adminFetch('/api/jarvis/tasks').then(r => r.ok ? r.json() : []),
      adminFetch('/api/jarvis/events').then(r => r.ok ? r.json() : []),
    ]).then(([t, e]) => {
      setTasks(Array.isArray(t) ? t : [])
      setEvents(Array.isArray(e) ? e : [])
      setLoading(false)
    })
  }
  useEffect(load, [])

  const bounds = useMemo(() => {
    const now = new Date()
    if (range === 'jour') return [startOfDay(now), endOfDay(now)]
    if (range === 'semaine') return [startOfWeek(now), endOfWeek(now)]
    return [startOfMonth(now), endOfMonth(now)]
  }, [range])

  const inRange = (d: Date) => d >= bounds[0] && d <= bounds[1]

  const visibleTasks = tasks
    .filter(t => t.due_date && inRange(new Date(`${t.due_date}T00:00:00`)))
    .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))
  const noDateTasks = tasks.filter(t => !t.due_date && t.status !== 'fait')
  const visibleEvents = events.filter(e => inRange(new Date(e.start_at))).sort((a, b) => a.start_at.localeCompare(b.start_at))

  const toggleTask = async (t: JarvisTask) => {
    const status = t.status === 'fait' ? 'a_faire' : 'fait'
    setTasks(prev => prev.map(x => x.id === t.id ? { ...x, status } : x))
    await adminFetch(`/api/jarvis/tasks/${t.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
  }

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    await adminFetch(`/api/jarvis/tasks/${id}`, { method: 'DELETE' })
  }

  const deleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    await adminFetch(`/api/jarvis/events/${id}`, { method: 'DELETE' })
  }

  if (loading) return <EmptyState>Chargement de l'agenda…</EmptyState>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Agenda</div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)' }}>Tâches et rendez-vous</div>
      </div>

      {/* Onglets période */}
      <div style={{ display: 'flex', gap: 6 }}>
        {(['jour', 'semaine', 'mois'] as Range[]).map(r => (
          <button key={r} onClick={() => setRange(r)} style={{
            flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: 12.5, fontWeight: 700, textTransform: 'capitalize',
            background: range === r ? 'linear-gradient(135deg,#22D3EE,#8B5CF6)' : 'rgba(255,255,255,0.06)',
            color: range === r ? '#05070C' : 'rgba(255,255,255,0.6)',
          }}>{r}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="ghost" onClick={() => setShowTaskForm(v => !v)} style={{ flex: 1 }}>+ Tâche</Button>
        <Button variant="ghost" onClick={() => setShowEventForm(v => !v)} style={{ flex: 1 }}>+ Rendez-vous</Button>
      </div>

      {showTaskForm && <TaskForm onCreated={t => { setTasks(prev => [t, ...prev]); setShowTaskForm(false) }} />}
      {showEventForm && <EventForm onCreated={e => { setEvents(prev => [...prev, e]); setShowEventForm(false) }} />}

      <Card>
        <SectionTitle>Rendez-vous ({visibleEvents.length})</SectionTitle>
        {visibleEvents.length === 0 ? <EmptyState>Aucun rendez-vous sur cette période</EmptyState> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visibleEvents.map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 16 }}>{EVENT_ICON[e.type]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{e.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                    {formatDateFR(e.start_at)} · {formatTimeFR(e.start_at)}
                    {e.with_person ? ` · avec ${e.with_person}` : ''}{e.location ? ` · ${e.location}` : ''}
                  </div>
                </div>
                <button onClick={() => deleteEvent(e.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13 }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle>Tâches ({visibleTasks.length})</SectionTitle>
        {visibleTasks.length === 0 ? <EmptyState>Aucune tâche sur cette période</EmptyState> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visibleTasks.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <input type="checkbox" checked={t.status === 'fait'} onChange={() => toggleTask(t)} style={{ width: 16, height: 16, accentColor: '#22D3EE' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, textDecoration: t.status === 'fait' ? 'line-through' : 'none', opacity: t.status === 'fait' ? 0.4 : 1 }}>{t.title}</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>{formatDateFR(t.due_date)}{t.category ? ` · ${t.category}` : ''}</div>
                </div>
                {t.priority === 'haute' && <Pill color="#F87171">haute</Pill>}
                <button onClick={() => deleteTask(t.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13 }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {noDateTasks.length > 0 && (
        <Card>
          <SectionTitle>Sans échéance ({noDateTasks.length})</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {noDateTasks.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <input type="checkbox" checked={t.status === 'fait'} onChange={() => toggleTask(t)} style={{ width: 16, height: 16, accentColor: '#22D3EE' }} />
                <div style={{ flex: 1, fontSize: 13 }}>{t.title}</div>
                <button onClick={() => deleteTask(t.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13 }}>✕</button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

function TaskForm({ onCreated }: { onCreated: (t: JarvisTask) => void }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10))
  const [priority, setPriority] = useState('normale')
  const [category, setCategory] = useState('perso')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!title.trim()) return
    setSaving(true)
    const res = await adminFetch('/api/jarvis/tasks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), due_date: dueDate || null, priority, category }),
    })
    if (res.ok) onCreated(await res.json())
    setSaving(false)
  }

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Input placeholder="Titre de la tâche" value={title} onChange={e => setTitle(e.target.value)} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ flex: 1 }} />
          <Select value={priority} onChange={e => setPriority(e.target.value)} style={{ flex: 1 }}>
            <option value="basse">Basse</option>
            <option value="normale">Normale</option>
            <option value="haute">Haute</option>
          </Select>
        </div>
        <Select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="perso">Perso</option>
          <option value="pro">Pro</option>
          <option value="boutique">Boutique</option>
          <option value="sante">Santé</option>
        </Select>
        <Button onClick={submit} disabled={saving}>Ajouter la tâche</Button>
      </div>
    </Card>
  )
}

function EventForm({ onCreated }: { onCreated: (e: JarvisEvent) => void }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('rdv')
  const [withPerson, setWithPerson] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState('12:00')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!title.trim() || !date || !time) return
    setSaving(true)
    const start_at = new Date(`${date}T${time}:00`).toISOString()
    const res = await adminFetch('/api/jarvis/events', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), type, with_person: withPerson || null, location: location || null, start_at }),
    })
    if (res.ok) onCreated(await res.json())
    setSaving(false)
  }

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Input placeholder="Titre (ex: Déjeuner avec Sami)" value={title} onChange={e => setTitle(e.target.value)} />
        <Select value={type} onChange={e => setType(e.target.value)}>
          {Object.entries(EVENT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ flex: 1 }} />
          <Input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ flex: 1 }} />
        </div>
        <Input placeholder="Avec qui (optionnel)" value={withPerson} onChange={e => setWithPerson(e.target.value)} />
        <Input placeholder="Lieu (optionnel)" value={location} onChange={e => setLocation(e.target.value)} />
        <Button onClick={submit} disabled={saving}>Ajouter le rendez-vous</Button>
      </div>
    </Card>
  )
}
