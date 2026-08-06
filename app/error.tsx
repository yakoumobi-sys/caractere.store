'use client'

import { useEffect } from 'react'

const C = { black: '#0C0A09', white: '#FAFAF9', lime: '#A3E635', muted: '#A8A29E', red: '#EF4444' }

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Visible côté client (F12 → Console) si jamais quelqu'un a accès à un PC ;
    // sinon le message ci-dessous est déjà affiché à l'écran, screenshotable depuis un téléphone.
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      background: C.black,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        background: C.black,
        border: `1px solid rgba(250,250,249,.1)`,
        borderRadius: 16,
        padding: 32,
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, color: C.white }}>
          Une erreur est survenue
        </h1>
        <p style={{ color: C.muted, marginBottom: 20, fontSize: 14 }}>
          Désolé, cette page a rencontré un problème. Réessaie, ou envoie-nous une capture
          d'écran de ce qui suit si ça se reproduit.
        </p>

        <pre style={{
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          background: `rgba(239,68,68,.1)`,
          border: `1px solid ${C.red}`,
          borderRadius: 8,
          color: C.red,
          fontSize: 12,
          padding: 12,
          marginBottom: 20,
        }}>
          {error.message || 'Erreur inconnue'}
          {error.digest ? `\n\ndigest: ${error.digest}` : ''}
        </pre>

        <button
          onClick={reset}
          style={{
            width: '100%',
            padding: 14,
            background: C.lime,
            color: C.black,
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
