'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase'

const C = { black: '#0C0A09', white: '#FAFAF9', lime: '#A3E635', muted: '#A8A29E', red: '#EF4444' }

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (data?.session) {
        router.push('/client/dashboard')
      }
    } catch (err) {
      setError('Erreur de connexion. Réessaye.')
    } finally {
      setLoading(false)
    }
  }

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
        maxWidth: 420,
        background: C.black,
        border: `1px solid rgba(250,250,249,.1)`,
        borderRadius: 16,
        padding: 40,
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, color: C.white }}>
          Se connecter
        </h1>
        <p style={{ color: C.muted, marginBottom: 32, fontSize: 14 }}>
          Retrouve tes commandes et designs
        </p>

        {error && (
          <div style={{
            padding: 12,
            background: `rgba(239,68,68,.1)`,
            border: `1px solid ${C.red}`,
            borderRadius: 8,
            color: C.red,
            fontSize: 12,
            marginBottom: 16,
            fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: C.white, marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: `rgba(250,250,249,.05)`,
                border: `1.5px solid rgba(250,250,249,.1)`,
                borderRadius: 10,
                color: C.white,
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              placeholder="ton@email.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: C.white, marginBottom: 6 }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: `rgba(250,250,249,.05)`,
                border: `1.5px solid rgba(250,250,249,.1)`,
                borderRadius: 10,
                color: C.white,
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 14,
              background: loading ? '#525252' : C.lime,
              color: loading ? C.muted : C.black,
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8,
              transition: 'all .2s',
            }}
          >
            {loading ? '⏳ Connexion...' : '🔓 Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: C.muted, marginTop: 20, borderTop: `1px solid rgba(250,250,249,.1)`, paddingTop: 20 }}>
          Tu n'as pas de compte?{' '}
          <Link href="/auth/signup" style={{ color: C.lime, fontWeight: 800, textDecoration: 'none' }}>
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
