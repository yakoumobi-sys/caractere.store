'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Avis } from '@/types'

function Star({ filled, size = 22 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#F5A623' : 'none'} stroke={filled ? '#F5A623' : '#D1D5DB'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
          className="p-0.5"
        >
          <Star filled={n <= (hover || value)} />
        </button>
      ))}
    </div>
  )
}

export default function AvisClient() {
  const [avis, setAvis] = useState<Avis[]>([])
  const [loadingAvis, setLoadingAvis] = useState(true)

  const [nom, setNom] = useState('')
  const [note, setNote] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/avis')
      .then(r => r.ok ? r.json() : [])
      .then(data => setAvis(Array.isArray(data) ? data : []))
      .catch(() => setAvis([]))
      .finally(() => setLoadingAvis(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nom.trim() || !commentaire.trim() || note === 0) {
      setStatus('error')
      return
    }
    setSubmitting(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: nom.trim(), note, commentaire: commentaire.trim() }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setNom('')
      setNote(0)
      setCommentaire('')
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-14">
        {/* Hero */}
        <div className="border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
          <div className="max-w-3xl mx-auto px-6 py-14 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">Avis clients</h1>
            <p className="text-gray-600">
              Votre avis nous aide à nous améliorer — et aide d'autres clients à nous faire confiance.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Formulaire */}
          {status === 'success' ? (
            <div className="rounded-2xl border p-8 text-center mb-16" style={{ borderColor: '#BBF7D0', background: '#F0FDF4' }}>
              <p className="text-2xl mb-2">🙏</p>
              <p className="font-bold text-black mb-1">Merci pour votre avis !</p>
              <p className="text-sm text-gray-600">
                Il sera publié après vérification par notre équipe.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-5 text-sm font-medium underline text-gray-700"
              >
                Laisser un autre avis
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border p-6 md:p-8 mb-16 space-y-5" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
              <h2 className="text-lg font-bold text-black">Laisser un avis</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
                <StarRating value={note} onChange={setNote} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Votre nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="Nom et prénom"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Votre commentaire</label>
                <textarea
                  value={commentaire}
                  onChange={e => setCommentaire(e.target.value)}
                  placeholder="Qu'avez-vous pensé de votre commande ?"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-600">Merci de remplir votre nom, une note et un commentaire.</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-3 bg-black text-white rounded font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {submitting ? 'Envoi...' : 'Envoyer mon avis'}
              </button>
            </form>
          )}

          {/* Avis publiés */}
          <div>
            <h2 className="text-lg font-bold text-black mb-6">Ce que disent nos clients</h2>
            {loadingAvis ? null : avis.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border" style={{ borderColor: 'rgba(0,0,0,0.06)', color: '#9CA3AF' }}>
                Soyez le premier à laisser un avis.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {avis.map(a => (
                  <div key={a.id} className="rounded-2xl border p-5" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                    <div className="flex items-center gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map(n => <Star key={n} filled={n <= a.note} size={16} />)}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">« {a.commentaire} »</p>
                    <p className="text-sm font-semibold text-black">{a.nom}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
