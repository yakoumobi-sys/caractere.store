import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/api-auth'
import { askClaude, AnthropicConfigError, type ChatMessage } from '@/lib/anthropic'

const HISTORY_LIMIT = 20

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function daysFromNow(n: number) {
  const d = startOfToday()
  d.setDate(d.getDate() + n)
  return d
}

// Construit le contexte "vie de l'utilisateur" injecté dans le system prompt,
// pour que JARVIS réponde en connaissant l'agenda, les finances et les objectifs.
async function buildContext() {
  const today = startOfToday()
  const in7 = daysFromNow(7)
  const todayStr = today.toISOString().slice(0, 10)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10)

  const [tasksRes, eventsRes, txRes, goalsRes, projectsRes] = await Promise.all([
    supabaseAdmin.from('jarvis_tasks').select('*').neq('status', 'fait').order('due_date', { ascending: true }).limit(30),
    supabaseAdmin.from('jarvis_events').select('*').gte('start_at', today.toISOString()).lte('start_at', in7.toISOString()).order('start_at', { ascending: true }),
    supabaseAdmin.from('jarvis_transactions').select('*').gte('date', monthStart),
    supabaseAdmin.from('jarvis_goals').select('*').neq('status', 'abandonne').order('created_at', { ascending: false }).limit(15),
    supabaseAdmin.from('jarvis_projects').select('*').neq('status', 'termine').order('created_at', { ascending: false }).limit(15),
  ])

  const tasks = tasksRes.data ?? []
  const events = eventsRes.data ?? []
  const tx = txRes.data ?? []
  const goals = goalsRes.data ?? []
  const projects = projectsRes.data ?? []

  const revenus = tx.filter(t => t.type === 'revenu').reduce((s, t) => s + Number(t.amount || 0), 0)
  const depenses = tx.filter(t => t.type === 'depense').reduce((s, t) => s + Number(t.amount || 0), 0)

  const lines: string[] = []
  lines.push(`Date du jour: ${todayStr}`)

  lines.push(`\nTâches en cours (non terminées):`)
  if (tasks.length === 0) lines.push('- (aucune)')
  tasks.forEach(t => lines.push(`- [${t.priority}] ${t.title}${t.due_date ? ` (échéance ${t.due_date})` : ''} — statut: ${t.status}`))

  lines.push(`\nÉvénements des 7 prochains jours:`)
  if (events.length === 0) lines.push('- (aucun)')
  events.forEach(e => lines.push(`- ${e.start_at} · ${e.title} (${e.type}${e.with_person ? `, avec ${e.with_person}` : ''}${e.location ? `, à ${e.location}` : ''})`))

  lines.push(`\nFinances du mois en cours: revenus ${revenus} / dépenses ${depenses} / solde ${revenus - depenses}`)

  lines.push(`\nObjectifs actifs:`)
  if (goals.length === 0) lines.push('- (aucun)')
  goals.forEach(g => lines.push(`- ${g.title} (${g.progress}%)${g.target_date ? `, cible ${g.target_date}` : ''}`))

  lines.push(`\nProjets actifs:`)
  if (projects.length === 0) lines.push('- (aucun)')
  projects.forEach(p => lines.push(`- ${p.name} (${p.progress}%, ${p.status})${p.deadline ? `, deadline ${p.deadline}` : ''}`))

  return lines.join('\n')
}

const SYSTEM_PROMPT_BASE = `Tu es JARVIS, l'assistant personnel et le mentor privé de l'utilisateur (Yakoumobi, fondateur de Caractère Store).
Tu es à la fois: un second cerveau qui connaît ses tâches, son agenda, ses finances, ses objectifs et ses projets (voir le contexte ci-dessous) — et un mentor direct, exigeant mais bienveillant, qui l'aide à prioriser, à tenir ses objectifs et à prendre de meilleures décisions.

Règles:
- Réponds en français, de façon concise et actionnable (listes courtes, pas de blabla).
- Si on te donne un email ou un message à résumer ou à répondre, fais-le directement (résumé en 2-4 puces, puis une proposition de réponse prête à copier-coller).
- Utilise le contexte fourni (tâches, agenda, finances, objectifs, projets) pour des réponses pertinentes et personnalisées — cite-le seulement si utile.
- Quand c'est pertinent, pousse-le à agir: rappelle les priorités, les échéances proches, les objectifs qui stagnent.
- Ne mentionne jamais que tu es un modèle d'IA générique ; tu es JARVIS, son assistant.

Contexte actuel:
`

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  let body: { message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const message = (body.message || '').trim()
  if (!message) return NextResponse.json({ error: 'Message vide' }, { status: 400 })

  // Historique récent pour garder le fil de la conversation
  const { data: history } = await supabaseAdmin
    .from('jarvis_messages')
    .select('role, content')
    .order('created_at', { ascending: false })
    .limit(HISTORY_LIMIT)

  const conversation: ChatMessage[] = (history ?? [])
    .slice()
    .reverse()
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  conversation.push({ role: 'user', content: message })

  let reply: string
  try {
    const context = await buildContext()
    reply = await askClaude({
      system: SYSTEM_PROMPT_BASE + context,
      messages: conversation,
      maxTokens: 1200,
    })
  } catch (err: any) {
    if (err instanceof AnthropicConfigError) {
      return NextResponse.json({ error: err.message, needsConfig: true }, { status: 503 })
    }
    return NextResponse.json({ error: err?.message || 'Erreur JARVIS' }, { status: 502 })
  }

  // Persiste l'échange (mémoire de JARVIS)
  await supabaseAdmin.from('jarvis_messages').insert([
    { role: 'user', content: message },
    { role: 'assistant', content: reply },
  ])

  return NextResponse.json({ reply })
}

// GET /api/jarvis/chat — historique de la conversation
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  const { data, error } = await supabaseAdmin
    .from('jarvis_messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(200)
  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(data)
}
