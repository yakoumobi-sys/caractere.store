// Client minimal pour l'API Claude (Anthropic) — utilisé par JARVIS.
// Pas de dépendance au SDK: un simple fetch suffit et évite d'alourdir le bundle.

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export class AnthropicConfigError extends Error {}

/**
 * Envoie une conversation à Claude et retourne le texte de la réponse.
 * Lève AnthropicConfigError si ANTHROPIC_API_KEY n'est pas configurée
 * (à distinguer d'une vraie erreur réseau/API pour un message clair côté UI).
 */
export async function askClaude({
  system,
  messages,
  maxTokens = 1024,
}: {
  system: string
  messages: ChatMessage[]
  maxTokens?: number
}): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new AnthropicConfigError(
      "ANTHROPIC_API_KEY n'est pas configurée sur le serveur. Ajoute-la dans les variables d'environnement pour activer JARVIS."
    )
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Anthropic API ${res.status}: ${errText || res.statusText}`)
  }

  const data = await res.json()
  const text = Array.isArray(data.content)
    ? data.content.map((b: any) => (b.type === 'text' ? b.text : '')).join('')
    : ''
  return text.trim()
}
