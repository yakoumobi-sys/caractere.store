"use client";

import { useState } from "react";

// ─────────────────────────────────────────────
// Config — edit copy, redirects & promo codes here
// ─────────────────────────────────────────────
const SEGMENTS = [
  {
    id: "b2b",
    label: "Je veux des uniformes pour mon entreprise",
    redirectUrl: "/collections/uniformes-entreprise",
    promoCode: "PRO15",
    discount: "15%",
    resultTitle: "Parfait pour les commandes pro.",
    resultBody:
      "Uniformes, tenues de travail, broderie de logo — devis rapide à partir de 10 pièces.",
  },
  {
    id: "b2c",
    label: "Je personnalise un t-shirt/cadeau",
    redirectUrl: "/designer",
    promoCode: "PERSO15",
    discount: "15%",
    resultTitle: "Créez le vôtre en 2 minutes.",
    resultBody:
      "Notre configurateur en ligne vous permet de visualiser votre design avant de commander — dès 1 pièce.",
  },
  {
    id: "pod",
    label: "Je veux commencer le print on demand",
    redirectUrl: "/pages/print-on-demand",
    promoCode: "POD15",
    discount: "15%",
    resultTitle: "Lancez votre marque sans stock.",
    resultBody:
      "On imprime et on expédie à la demande. Vous vendez, on s'occupe du reste.",
  },
  {
    id: "sample",
    label: "Je veux un échantillon avant de commander en gros",
    redirectUrl: "/collections/echantillons",
    promoCode: "SAMPLE15",
    discount: "15%",
    resultTitle: "Testez la qualité d'abord.",
    resultBody:
      "Commandez un échantillon à prix réduit avant votre commande en gros — zéro risque.",
  },
];

export default function CaracterePopup() {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(null);

  if (!open) return null;

  const handleSelect = (segment) => setSelected(segment);

  const handleClose = () => setOpen(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#FAF7F0] shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Fermer"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-stone-700 hover:bg-black/10 transition"
        >
          <X size={16} />
        </button>

        {/* Header band */}
        <div className="bg-[#1C1C1A] px-6 pt-7 pb-5 text-center">
          <span className="font-serif text-2xl tracking-wide text-[#E8DCC0]">
            Caractère
          </span>
        </div>

        <div className="px-6 py-7">
          {!selected ? (
            <>
              <h2 className="text-center text-xl font-semibold leading-snug text-stone-900">
                Vous avez débloqué
                <br />
                <span className="text-[#B8722E]">-15% de réduction</span>
              </h2>
              <p className="mt-2 text-center text-sm text-stone-600">
                Dites-nous ce que vous cherchez pour récupérer votre code :
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                {SEGMENTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(s)}
                    className="rounded-full border border-stone-300 bg-white px-5 py-3 text-left text-sm font-medium text-stone-800 transition hover:border-[#1C1C1A] hover:bg-stone-50"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleClose}
                className="mt-5 w-full text-center text-xs text-stone-400 underline hover:text-stone-600"
              >
                Non merci, je ne veux pas de réduction
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <Sparkles className="mb-3 text-[#B8722E]" size={28} />
              <h2 className="text-lg font-semibold text-stone-900">
                {selected.resultTitle}
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                {selected.resultBody}
              </p>

              <div className="mt-5 w-full rounded-xl border-2 border-dashed border-[#B8722E] bg-[#FFF6EA] py-3">
                <p className="text-[11px] uppercase tracking-wide text-stone-500">
                  Votre code
                </p>
                <p className="text-xl font-bold tracking-widest text-[#B8722E]">
                  {selected.promoCode}
                </p>
              </div>

              <a
                href={selected.redirectUrl}
                className="mt-5 w-full rounded-full bg-[#1C1C1A] py-3 text-sm font-semibold text-[#E8DCC0] transition hover:bg-stone-800"
              >
                Voir les produits ({selected.discount} appliqué)
              </a>

              <button
                onClick={() => setSelected(null)}
                className="mt-3 text-xs text-stone-400 underline hover:text-stone-600"
              >
                Retour
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
