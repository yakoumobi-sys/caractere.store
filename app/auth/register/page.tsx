'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-black-transparent.png'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nom, setNom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async () => {
  if (!email || !password || !nom) return setError('Tous les champs sont requis.')
  if (password.length < 6) return setError('Le mot de passe doit faire au moins 6 caractères.')
  setLoading(true)
  setError(null)
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: nom } },
  })
  if (error) { setError(error.message); setLoading(false); return }
  router.push('/dashboard')
}
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  if (success) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-[48px] mb-4">📬</div>
          <h2 className="text-[22px] font-bold text-brand-dark mb-2">Vérifiez votre email</h2>
          <p className="text-[14px] text-brand-gray">
            Un lien de confirmation a été envoyé à <strong>{email}</strong>. Cliquez dessus pour activer votre compte.
          </p>
          <Link href="/auth/login" className="inline-block mt-6 text-[14px] text-brand-dark underline">
            Retour à la connexion
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/">
          <img src={LOGO} alt="Caractère" className="h-10 w-auto mx-auto mb-8 object-contain" />
        </Link>

        <h1 className="text-[24px] font-bold text-brand-dark text-center mb-1">Créer un compte</h1>
        <p className="text-[14px] text-brand-gray text-center mb-8">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-brand-dark font-medium underline">
            Se connecter
          </Link>
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            placeholder="Nom complet"
            value={nom}
            onChange={e => setNom(e.target.value)}
            className="w-full border border-black/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-brand-dark"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-black/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-brand-dark"
          />
          <input
            type="password"
            placeholder="Mot de passe (min. 6 caractères)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-black/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-brand-dark"
          />
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-brand-dark text-white py-3 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-[12px] text-brand-gray">ou</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full border border-black/15 rounded-full py-3 text-[14px] font-medium text-brand-dark flex items-center justify-center gap-2 hover:bg-brand-light transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continuer avec Google
        </button>
      </div>
    </main>
  )
}
