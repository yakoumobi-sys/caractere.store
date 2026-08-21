'use client'
import { useEffect, useState } from 'react'
import { adminFetch } from '@/lib/adminFetch'
import { Card, SectionTitle, Pill, Button, Input, Select, TextArea, ProgressBar, EmptyState } from '@/components/jarvis/ui'
import { formatDateFR } from '@/lib/jarvis-dates'
import type { JarvisGoal, JarvisProject } from '@/types'

export default function ObjectifsPage() {
  const [tab, setTab] = useState<'objectifs' | 'projets'>('objectifs')
  const [goals, setGoals] = useState<JarvisGoal[]>([])
  const [projects, setProjects] = useState<JarvisProject[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    Promise.all([
      adminFetch('/api/jarvis/goals').then(r => r.ok ? r.json() : []),
      adminFetch('/api/jarvis/projects').then(r => r.ok ? r.json() : []),
    ]).then(([g, p]) => {
      setGoals(Array.isArray(g) ? g : [])
      setProjects(Array.isArray(p) ? p : [])
      setLoading(false)
    })
  }
  useEffect(load, [])

  const updateGoalProgress = async (g: JarvisGoal, progress: number) => {
    const status = progress >= 100 ? 'atteint' : 'en_cours'
    setGoals(prev => prev.map(x => x.id === g.id ? { ...x, progress, status } : x))
    await adminFetch(`/api/jarvis/goals/${g.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ progress, status }) })
  }

  const updateProjectProgress = async (p: JarvisProject, progress: number) => {
    const status = progress >= 100 ? 'termine' : p.status === 'en_pause' ? 'en_pause' : 'actif'
    setProjects(prev => prev.map(x => x.id === p.id ? { ...x, progress, status } : x))
    await adminFetch(`/api/jarvis/projects/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ progress, status }) })
  }

  const deleteGoal = async (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
    await adminFetch(`/api/jarvis/goals/${id}`, { method: 'DELETE' })
  }
  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    await adminFetch(`/api/jarvis/projects/${id}`, { method: 'DELETE' })
  }

  if (loading) return <EmptyState>Chargement…</EmptyState>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Objectifs & Projets</div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)' }}>Ce que tu construis, sur la durée</div>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {(['objectifs', 'projets'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setShowForm(false) }} style={{
            flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: 12.5, fontWeight: 700, textTransform: 'capitalize',
            background: tab === t ? 'linear-gradient(135deg,#22D3EE,#8B5CF6)' : 'rgba(255,255,255,0.06)',
            color: tab === t ? '#05070C' : 'rgba(255,255,255,0.6)',
          }}>{t}</button>
        ))}
      </div>

      <Button variant="ghost" onClick={() => setShowForm(v => !v)}>+ {tab === 'objectifs' ? 'Nouvel objectif' : 'Nouveau projet'}</Button>

      {showForm && tab === 'objectifs' && <GoalForm onCreated={g => { setGoals(prev => [g, ...prev]); setShowForm(false) }} />}
      {showForm && tab === 'projets' && <ProjectForm onCreated={p => { setProjects(prev => [p, ...prev]); setShowForm(false) }} />}

      {tab === 'objectifs' ? (
        goals.length === 0 ? <EmptyState>Aucun objectif — fixe ta première cible 🎯</EmptyState> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {goals.map(g => (
              <Card key={g.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{g.title}</div>
                    {g.description && <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{g.description}</div>}
                    <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                      {g.category}{g.target_date ? ` · cible ${formatDateFR(g.target_date)}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {g.status === 'atteint' && <Pill color="#34D399">atteint</Pill>}
                    <button onClick={() => deleteGoal(g.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
                <ProgressBar value={g.progress} />
                <input type="range" min={0} max={100} step={5} value={g.progress} onChange={e => updateGoalProgress(g, Number(e.target.value))} style={{ width: '100%', marginTop: 8, accentColor: '#22D3EE' }} />
              </Card>
            ))}
          </div>
        )
      ) : (
        projects.length === 0 ? <EmptyState>Aucun projet en cours</EmptyState> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {projects.map(p => (
              <Card key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                    {p.description && <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{p.description}</div>}
                    <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                      {p.deadline ? `deadline ${formatDateFR(p.deadline)}` : 'pas de deadline'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Pill color={p.status === 'termine' ? '#34D399' : p.status === 'en_pause' ? '#FBBF24' : '#22D3EE'}>{p.status}</Pill>
                    <button onClick={() => deleteProject(p.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
                <ProgressBar value={p.progress} color="#8B5CF6" />
                <input type="range" min={0} max={100} step={5} value={p.progress} onChange={e => updateProjectProgress(p, Number(e.target.value))} style={{ width: '100%', marginTop: 8, accentColor: '#8B5CF6' }} />
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}

function GoalForm({ onCreated }: { onCreated: (g: JarvisGoal) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('perso')
  const [targetDate, setTargetDate] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!title.trim()) return
    setSaving(true)
    const res = await adminFetch('/api/jarvis/goals', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), description: description || null, category, target_date: targetDate || null }),
    })
    if (res.ok) onCreated(await res.json())
    setSaving(false)
  }

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Input placeholder="Titre de l'objectif" value={title} onChange={e => setTitle(e.target.value)} />
        <TextArea placeholder="Description (optionnel)" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Select value={category} onChange={e => setCategory(e.target.value)} style={{ flex: 1 }}>
            <option value="perso">Perso</option>
            <option value="pro">Pro</option>
            <option value="sante">Santé</option>
            <option value="finance">Finance</option>
          </Select>
          <Input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} style={{ flex: 1 }} />
        </div>
        <Button onClick={submit} disabled={saving}>Créer l'objectif</Button>
      </div>
    </Card>
  )
}

function ProjectForm({ onCreated }: { onCreated: (p: JarvisProject) => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!name.trim()) return
    setSaving(true)
    const res = await adminFetch('/api/jarvis/projects', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), description: description || null, deadline: deadline || null }),
    })
    if (res.ok) onCreated(await res.json())
    setSaving(false)
  }

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Input placeholder="Nom du projet" value={name} onChange={e => setName(e.target.value)} />
        <TextArea placeholder="Description (optionnel)" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
        <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
        <Button onClick={submit} disabled={saving}>Créer le projet</Button>
      </div>
    </Card>
  )
}
