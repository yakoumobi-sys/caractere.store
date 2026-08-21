'use client'
import { useEffect, useRef, useState } from 'react'
import { adminFetch } from '@/lib/adminFetch'
import { Button, TextArea, EmptyState } from '@/components/jarvis/ui'
import type { JarvisMessage } from '@/types'

const QUICK_ACTIONS = [
  { label: '📧 Résumer un mail', template: "Résume cet email en 3-4 puces et propose-moi une réponse courte, prête à envoyer :\n\n" },
  { label: '✍️ Répondre à un message', template: "Voici un message que j'ai reçu. Propose-moi 2 réponses possibles (une courte, une plus détaillée) :\n\n" },
  { label: '🎯 Priorités du jour', template: "Vu mon agenda, mes tâches et mes objectifs, quelles sont mes 3 priorités absolues aujourd'hui ?" },
  { label: '💰 Bilan financier', template: "Fais-moi un point rapide sur mes finances du mois et donne-moi un conseil concret." },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<JarvisMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    adminFetch('/api/jarvis/chat').then(r => r.ok ? r.json() : []).then(d => {
      setMessages(Array.isArray(d) ? d : [])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const send = async (text?: string) => {
    const message = (text ?? input).trim()
    if (!message || sending) return
    setError(null)
    setInput('')
    setMessages(prev => [...prev, { id: `tmp-${Date.now()}`, role: 'user', content: message, created_at: new Date().toISOString() }])
    setSending(true)
    try {
      const res = await adminFetch('/api/jarvis/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "JARVIS n'a pas pu répondre.")
      } else {
        setMessages(prev => [...prev, { id: `tmp-a-${Date.now()}`, role: 'assistant', content: data.reply, created_at: new Date().toISOString() }])
      }
    } catch {
      setError('Connexion à JARVIS impossible. Réessaie.')
    }
    setSending(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 200px)', minHeight: 420 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>✦ JARVIS</div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)' }}>Ton second cerveau — mentor, mails, priorités</div>
      </div>

      {/* Actions rapides */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, marginBottom: 4 }}>
        {QUICK_ACTIONS.map(a => (
          <button key={a.label} onClick={() => setInput(a.template)} style={{
            flexShrink: 0, padding: '7px 12px', borderRadius: 20, whiteSpace: 'nowrap',
            fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.75)',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
          }}>{a.label}</button>
        ))}
      </div>

      {/* Fil de conversation */}
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10,
        padding: '8px 2px',
      }}>
        {loading ? (
          <EmptyState>Chargement de la conversation…</EmptyState>
        ) : messages.length === 0 ? (
          <EmptyState>
            Salut. Je suis JARVIS — dis-moi ce qu'il te faut : un résumé de mail, une réponse à rédiger, un point sur tes priorités ou tes finances.
          </EmptyState>
        ) : (
          messages.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '86%', padding: '10px 13px', borderRadius: 14,
                fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap',
                background: m.role === 'user' ? 'linear-gradient(135deg, #22D3EE, #8B5CF6)' : 'rgba(255,255,255,0.06)',
                color: m.role === 'user' ? '#05070C' : '#fff',
                border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                borderBottomRightRadius: m.role === 'user' ? 4 : 14,
                borderBottomLeftRadius: m.role === 'assistant' ? 4 : 14,
              }}>
                {m.content}
              </div>
            </div>
          ))
        )}
        {sending && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '10px 13px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              JARVIS réfléchit…
            </div>
          </div>
        )}
        {error && (
          <div style={{ fontSize: 11.5, color: '#F87171', padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 10 }}>
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Saisie */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'flex-end' }}>
        <TextArea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Écris à JARVIS… (colle un email pour un résumé/réponse)"
          rows={2}
          style={{ flex: 1 }}
        />
        <Button onClick={() => send()} disabled={sending || !input.trim()}>↑</Button>
      </div>
    </div>
  )
}
