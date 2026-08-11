'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase'

const C = { black: '#0C0A09', white: '#FAFAF9', lime: '#A3E635', muted: '#A8A29E', red: '#EF4444' }

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Créer l'utilisateur
      const { data, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data?.user) {
        setSuccess(true)
        // Redirige vers l'onboarding (choix d'intention + accueil personnalisé)
        // après 2s, comme le fait déjà /auth/register.
        const prenom = fullName.trim().split(' ')[0] || 'toi'
        setTimeout(() => {
          router.push(`/auth/onboarding?prenom=${encodeURIComponent(prenom)}`)
        }, 2000)
      }
    } catch (err) {
      setError('Erreur lors de l\'inscription. Réessaye.')
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
          Créer un compte
        </h1>
        <p style={{ color: C.muted, marginBottom: 32, fontSize: 14 }}>
          Lance ta marque en 2 minutes
        </p>

        {success ? (
          <div style={{
            padding: 20,
            background: `rgba(163,230,53,.1)`,
            border: `1px solid ${C.lime}`,
            borderRadius: 10,
            color: C.lime,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 700,
          }}>
            ✅ Compte créé! Redirection vers ton dashboard...
          </div>
        ) : (
          <>
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

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: C.white, marginBottom: 6 }}>
                  Nom complet
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  placeholder="Leila M."
                />
              </div>

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
                  placeholder="leila@marque.dz"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: C.white, marginBottom: 6 }}>
                  Mot de passe (min 8 caractères)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
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
                {loading ? '⏳ Création...' : '✓ Créer mon compte'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: C.muted, marginTop: 20, borderTop: `1px solid rgba(250,250,249,.1)`, paddingTop: 20 }}>
              Tu as déjà un compte?{' '}
              <Link href="/auth/login" style={{ color: C.lime, fontWeight: 800, textDecoration: 'none' }}>
                Se connecter
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
