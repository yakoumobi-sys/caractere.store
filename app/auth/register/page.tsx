'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-black-transparent.png'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [prenom, setPrenom]     = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const handleRegister = async () => {
    if (!email || !password || !prenom) return setError('Tous les champs sont requis.')
    if (password.length < 6) return setError('Le mot de passe doit faire au moins 6 caractères.')
    setLoading(true)
    setError(null)
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: prenom } },
    })
    if (authError) { setError(authError.message); setLoading(false); return }
    // Redirige vers onboarding avec le prénom
    router.push(`/auth/onboarding?prenom=${encodeURIComponent(prenom)}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F8FAFB' }}>
      <div className="w-full max-w-sm">
        <Link href="/">
          <img src={LOGO} alt="Caractère" className="h-10 w-auto mx-auto mb-8 object-contain" />
        </Link>

        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-black/[0.06]">
          <h1 className="text-[22px] font-black tracking-tight text-center mb-1" style={{ color: '#0C1A26' }}>
            Créer mon compte
          </h1>
          <p className="text-[13px] text-center mb-6" style={{ color: '#1E3A5F' }}>
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="font-bold underline" style={{ color: '#0C4A6E' }}>
              Se connecter
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold tracking-wide uppercase" style={{ color: '#1E3A5F' }}>Prénom</label>
              <input
                placeholder="Votre prénom"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                className="w-full border-2 rounded-xl px-4 py-3 text-[14px] outline-none transition-colors"
                style={{ borderColor: '#BAE6FD' }}
                onFocus={e => e.target.style.borderColor = '#0C4A6E'}
                onBlur={e => e.target.style.borderColor = '#BAE6FD'}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold tracking-wide uppercase" style={{ color: '#1E3A5F' }}>Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border-2 rounded-xl px-4 py-3 text-[14px] outline-none transition-colors"
                style={{ borderColor: '#BAE6FD' }}
                onFocus={e => e.target.style.borderColor = '#0C4A6E'}
                onBlur={e => e.target.style.borderColor = '#BAE6FD'}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold tracking-wide uppercase" style={{ color: '#1E3A5F' }}>Mot de passe</label>
              <input
                type="password"
                placeholder="6 caractères minimum"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border-2 rounded-xl px-4 py-3 text-[14px] outline-none transition-colors"
                style={{ borderColor: '#BAE6FD' }}
                onFocus={e => e.target.style.borderColor = '#0C4A6E'}
                onBlur={e => e.target.style.borderColor = '#BAE6FD'}
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3.5 rounded-full text-[15px] font-bold text-white transition-all disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #0C4A6E, #1E6FA8)', boxShadow: '0 4px 16px rgba(12,74,110,0.3)' }}
            >
              {loading ? 'Création...' : 'Créer mon compte →'}
            </button>
          </div>
        </div>

        <p className="text-[11px] text-center mt-4" style={{ color: '#7DD3FC' }}>
          Sans abonnement · Sans engagement
        </p>
      </div>
    </main>
  )
}
