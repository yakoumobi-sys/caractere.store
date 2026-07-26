'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('yakoumobi@gmail.com')
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
        // Sauvegarde la session
        localStorage.setItem('admin_token', data.session.access_token)
        router.push('/admin')
      }
    } catch (err) {
      setError('Erreur réseau. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
      padding: 16,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#fff',
        borderRadius: 16,
        padding: 32,
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      }}>
        {/* Logo/Titre */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎨</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1E293B', margin: 0 }}>
            Caractère Admin
          </h1>
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>
            Gestion centralisée de vos commandes
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{
            padding: 12,
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 8,
            color: '#DC2626',
            fontSize: 12,
            marginBottom: 16,
            fontWeight: 500,
          }}>
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 700,
              color: '#1E293B',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}>
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
                border: '1.5px solid #E2E8F0',
                borderRadius: 10,
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3B82F6'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 700,
              color: '#1E293B',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}>
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
                border: '1.5px solid #E2E8F0',
                borderRadius: 10,
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3B82F6'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 14,
              background: loading ? '#CBD5E1' : '#1E293B',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginTop: 8,
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = '#0F172A'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = '#1E293B'
            }}
          >
            {loading ? '⏳ Connexion...' : '🔓 Se connecter'}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          fontSize: 11,
          color: '#94A3B8',
          textAlign: 'center',
          marginTop: 20,
          borderTop: '1px solid #F1F5F9',
          paddingTop: 20,
        }}>
          Contact d'admin : yakoumobi@gmail.com
        </p>
      </div>
    </div>
  )
}
