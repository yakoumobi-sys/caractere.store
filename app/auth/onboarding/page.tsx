'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-black-transparent.png'

const C = {
  blue:   '#0C4A6E',
  blueMid:'#1E6FA8',
  blueAcc:'#38BDF8',
  gray1:  '#F0F7FF',
  gray2:  '#BAE6FD',
  gray4:  '#1E3A5F',
  black:  '#0C1A26',
  white:  '#FFFFFF',
}

const INTENTIONS = [
  {
    id: 'pod',
    emoji: '🚀',
    title: 'Lancer ma marque',
    desc: 'Print on Demand, boutique en ligne, vente à mes clients.',
  },
  {
    id: 'entreprise',
    emoji: '🏢',
    title: 'Habiller mon équipe',
    desc: 'Uniformes, tenues de travail, goodies corporate.',
  },
  {
    id: 'particulier',
    emoji: '👕',
    title: 'Usage personnel',
    desc: 'Un vêtement unique, cadeau, événement familial.',
  },
]

function OnboardingInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const prenom       = searchParams.get('prenom') || 'toi'

  const [step, setStep]           = useState<1 | 2>(1)
  const [selected, setSelected]   = useState<string | null>(null)
  const [saving, setSaving]       = useState(false)

  const handleContinue = async () => {
    if (!selected) return
    setSaving(true)
    // Sauvegarde l'intention dans les métadonnées user
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.auth.updateUser({
        data: { ...user.user_metadata, intention: selected }
      })
    }
    setSaving(false)
    setStep(2)
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  // ─── Étape 2 : Bienvenue ────────────────────────────────────────────────────
  if (step === 2) {
    const intention = INTENTIONS.find(i => i.id === selected)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: `linear-gradient(150deg, #0C4A6E 0%, #0E5E8A 55%, #38BDF8 100%)` }}>

        {/* Halo */}
        <div className="absolute pointer-events-none" style={{ top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(186,230,253,0.2) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-sm w-full">
          {/* Animation confetti simulée avec emojis */}
          <div className="text-[64px] mb-4 animate-bounce">🎉</div>

          <h1 className="text-[28px] font-black text-white tracking-tight mb-2">
            Bienvenue, {prenom} !
          </h1>
          <p className="text-[15px] mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Ton compte est prêt.{intention ? ` On est là pour t'aider à ${intention.title.toLowerCase()}.` : ''}
          </p>

          {/* Card récap intention */}
          {intention && (
            <div className="rounded-2xl p-5 mb-8 text-left"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center gap-3">
                <span className="text-[28px]">{intention.emoji}</span>
                <div>
                  <p className="text-[14px] font-bold text-white">{intention.title}</p>
                  <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{intention.desc}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prochaines étapes */}
          <div className="flex flex-col gap-2 mb-8">
            {[
              { n: '01', text: 'Choisis tes produits dans le catalogue' },
              { n: '02', text: 'Uploade ton logo dans le Designer' },
              { n: '03', text: 'Configure ta commande en 2 min' },
            ].map(s => (
              <div key={s.n} className="flex items-center gap-3 text-left px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                <span className="text-[12px] font-black w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#BAE6FD' }}>
                  {s.n}
                </span>
                <p className="text-[13px] font-medium text-white">{s.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleGoToDashboard}
            className="w-full py-4 rounded-full text-[16px] font-black transition-all hover:-translate-y-0.5"
            style={{ background: C.white, color: C.blue, boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
          >
            Accéder à mon espace →
          </button>
        </div>
      </main>
    )
  }

  // ─── Étape 1 : Intention ────────────────────────────────────────────────────
  return (
    <main className="min-h-screen flex flex-col px-6 py-10" style={{ background: '#F8FAFB' }}>
      <div className="max-w-sm w-full mx-auto flex flex-col flex-1">

        {/* Logo */}
        <img src={LOGO} alt="Caractère" className="h-8 w-auto object-contain mb-10 mx-auto" />

        {/* Barre de progression */}
        <div className="flex gap-1.5 mb-8">
          <div className="flex-1 h-1 rounded-full" style={{ background: C.blue }} />
          <div className="flex-1 h-1 rounded-full" style={{ background: '#E2E8F0' }} />
        </div>

        <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: C.blueMid }}>
          Étape 1 sur 2
        </p>
        <h1 className="text-[24px] font-black tracking-tight mb-2" style={{ color: C.black }}>
          Que veux-tu faire avec Caractère ?
        </h1>
        <p className="text-[14px] mb-8 leading-relaxed" style={{ color: C.gray4 }}>
          On personnalise ton expérience selon ton projet.
        </p>

        {/* Choix */}
        <div className="flex flex-col gap-3 flex-1">
          {INTENTIONS.map(item => {
            const isSelected = selected === item.id
            return (
              <button
                key={item.id}
                onClick={() => setSelected(item.id)}
                className="w-full text-left p-5 rounded-2xl border-2 transition-all"
                style={{
                  borderColor: isSelected ? C.blue : C.gray2,
                  background: isSelected ? C.gray1 : C.white,
                  boxShadow: isSelected ? `0 0 0 3px rgba(12,74,110,0.1)` : 'none',
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[24px] flex-shrink-0"
                    style={{ background: isSelected ? C.blue + '15' : '#F1F5F9' }}>
                    {item.emoji}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-[15px] font-bold mb-0.5" style={{ color: C.black }}>{item.title}</p>
                    <p className="text-[13px] leading-snug" style={{ color: C.gray4 }}>{item.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all`}
                    style={{ borderColor: isSelected ? C.blue : C.gray2, background: isSelected ? C.blue : 'transparent' }}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected || saving}
          className="w-full py-4 rounded-full text-[15px] font-black mt-6 transition-all disabled:opacity-40"
          style={{ background: C.blue, color: C.white, boxShadow: selected ? '0 6px 20px rgba(12,74,110,0.3)' : 'none' }}
        >
          {saving ? 'Enregistrement...' : 'Continuer →'}
        </button>

        <p className="text-[11px] text-center mt-4" style={{ color: C.gray2 }}>
          Tu pourras changer ça plus tard dans ton profil.
        </p>
      </div>
    </main>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#F8FAFB' }}>
        <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin" />
      </main>
    }>
      <OnboardingInner />
    </Suspense>
  )
}
