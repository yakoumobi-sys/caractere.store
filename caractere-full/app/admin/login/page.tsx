'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setErr('')
    const res = await fetch('/api/auth', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ password: pw }) })
    if (res.ok) {
      router.push('/admin')
    } else {
      setErr('Mot de passe incorrect')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-6">
      <div className="bg-white rounded-[24px] p-10 w-full max-w-[380px] shadow-sm border border-black/[0.06]">
        <div className="w-12 h-12 bg-brand-dark rounded-[14px] flex items-center justify-center text-white text-[20px] font-bold mb-6">C</div>
        <h1 className="text-[22px] font-bold tracking-tight mb-1">Espace admin</h1>
        <p className="text-[14px] text-brand-gray mb-8">Caractère Store</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium">Mot de passe</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" className="border border-black/[0.12] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-black/30" autoFocus />
          </div>
          {err && <p className="text-[13px] text-red-500">{err}</p>}
          <button type="submit" disabled={loading} className="bg-brand-dark text-white py-3 rounded-full text-[14px] font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
