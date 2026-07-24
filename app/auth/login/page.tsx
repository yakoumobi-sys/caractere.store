// app/auth/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) { 
      setError('Email et mot de passe requis.')
      return 
    }
    
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const { error: apiError } = await res.json()
        setError(apiError || 'Erreur de connexion')
        setLoading(false)
        return
      }

      router.push('/admin')
    } catch (err) {
      setError('Erreur réseau')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-[24px] font-bold text-center mb-6">Connexion Admin</h1>
        {error && (
          <div className="bg-red-100 text-red-700 text-[13px] rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}
        <div className="space-y-3">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full border border-black/15 rounded-xl px-4 py-3 text-[14px] outline-none" 
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full border border-black/15 rounded-xl px-4 py-3 text-[14px] outline-none" 
          />
          <button 
            onClick={handleLogin} 
            disabled={loading} 
            className="w-full bg-black text-white py-3 rounded-full text-[15px] font-medium disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </div>
    </main>
  )
}
