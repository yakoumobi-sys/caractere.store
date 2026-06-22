'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Commande } from '@/types'

const STATUT_LABELS: Record<Commande['statut'], { label: string; color: string }> = {
  nouveau: { label: 'Reçue', color: 'bg-amber-100 text-amber-800' },
  en_cours: { label: 'En production', color: 'bg-blue-100 text-blue-800' },
  termine: { label: 'Terminée', color: 'bg-green-100 text-green-800' },
  annule: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
}

const STEPS: Commande['statut'][] = ['nouveau', 'en_cours', 'termine']

export default function SuiviPage() {
  const params = useParams()
  const reference = params?.reference as string

  const [commande, setCommande] = useState<Commande | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reference) return
    fetch(`/api/commandes?reference=${encodeURIComponent(reference)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('introuvable')
        const data = await res.json()
        setCommande(data)
      })
      .catch(() => setError('Commande introuvable. Vérifiez votre référence.'))
      .finally(() => setLoading(false))
  }, [reference])

  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen bg-white">
        <div className="max-w-[600px] mx-auto px-6 py-16">
          {loading && (
            <p className="text-center text-brand-gray text-[14px]">Chargement…</p>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-[18px] font-semibold text-brand-dark mb-2">
                Commande introuvable
              </p>
              <p className="text-[14px] text-brand-gray">{error}</p>
            </div>
          )}

          {commande && (
            <>
              <div className="text-center mb-10">
                <p className="text-[13px] text-brand-gray mb-1">Référence commande</p>
                <div className="text-[22px] font-bold font-mono bg-brand-light rounded-2xl px-6 py-3 inline-block tracking-widest">
                  {commande.reference}
                </div>
              </div>

              {/* Statut + progression */}
              <div className="mb-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span
                    className={`text-[13px] font-medium px-3 py-1 rounded-full ${STATUT_LABELS[commande.statut].color}`}
                  >
                    {STATUT_LABELS[commande.statut].label}
                  </span>
                </div>

                {commande.statut !== 'annule' && (
                  <div className="flex items-center justify-center gap-0">
                    {STEPS.map((s, i) => {
                      const currentIndex = STEPS.indexOf(commande.statut)
                      const done = i <= currentIndex
                      return (
                        <div key={s} className="flex items-center">
                          {i > 0 && (
                            <div
                              className={`w-12 h-px mx-1 ${done ? 'bg-brand-dark' : 'bg-black/10'}`}
                            />
                          )}
                          <div
                            className={`w-3 h-3 rounded-full ${done ? 'bg-brand-dark' : 'bg-black/15'}`}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Détails commande */}
              <div className="bg-brand-light rounded-2xl p-6 mb-6 space-y-3">
                <div className="flex justify-between text-[14px]">
                  <span className="text-brand-gray">Produit</span>
                  <span className="font-medium text-brand-dark">{commande.produit}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-brand-gray">Quantité</span>
                  <span className="font-medium text-brand-dark">{commande.quantite}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-brand-gray">Couleur</span>
                  <span className="font-medium text-brand-dark">{commande.couleur}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-brand-gray">Technique</span>
                  <span className="font-medium text-brand-dark">{commande.technique}</span>
                </div>
                <div className="h-px bg-black/10 my-2" />
                <div className="flex justify-between text-[16px]">
                  <span className="font-semibold text-brand-dark">Total</span>
                  <span className="font-bold text-brand-dark">
                    {commande.prix_total?.toLocaleString('fr-FR')} DA
                  </span>
                </div>
              </div>

              {/* Paiement — à compléter avec RIB / Chargily */}
              {commande.statut !== 'annule' && commande.statut !== 'termine' && (
                <div className="border-2 border-dashed border-black/15 rounded-2xl p-6 text-center">
                  <p className="text-[14px] font-semibold text-brand-dark mb-1">
                    Paiement
                  </p>
                  <p className="text-[13px] text-brand-gray">
                    Notre équipe vous contacte par WhatsApp au {commande.telephone} pour finaliser
                    le paiement.
                  </p>
                  {/* TODO: remplacer par les vraies infos RIB / bouton Chargily une fois fournies */}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}