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

  const handleRegister = async () => {
    if (!email || !password || !nom) return setError('Tous les champs sont requis.')
    if (password.length < 6) return setError('Le mot de passe doit faire au moins 6 caracteres.')
    setLoading(true)
    setError(null)
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: nom } },
    })
    if (authError) { setError(authError.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/">
          <img src={LOGO} alt="Caractere" className="h-10 w-auto mx-auto mb-8 object-contain" />
        </Link>
        <h1 className="text-[24px] font-bold text-brand-dark text-center mb-1">Creer un compte</h1>
        <p className="text-[14px] text-brand-gray text-center mb-8">
          Deja un compte ?{' '}
          <Link href="/auth/login" className="text-brand-dark font-medium underline">Se connecter</Link>
        </p>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}
        <div className="space-y-3">
          <input placeholder="Nom complet" value={nom} onChange={e => setNom(e.target.value)} className="w-full border border-black/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-brand-dark" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-black/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-brand-dark" />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-black/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-brand-dark" />
          <button onClick={handleRegister} disabled={loading} className="w-full bg-brand-dark text-white py-3 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50">
            {loading ? 'Creation...' : 'Creer mon compte'}
          </button>
        </div>
      </div>
    </main>
  )
}
