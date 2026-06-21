"use client";

import { useState, useEffect } from "react";

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

const SHOW_DELAY_MS = 5000; // délai avant affichage
const COUNTDOWN_SECONDS = 60; // 1 minute
const LOGO_URL = "/logo.png"; // ← remplace par le chemin réel de ton logo

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CaracterePopup() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(null);
  const [applied, setApplied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  // Affiche le popup après un délai
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Compte à rebours, démarre une fois le popup visible
  useEffect(() => {
    if (!visible || !open) return;
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [visible, open, secondsLeft]);

  if (!visible || !open) return null;

  const handleSelect = (segment) => {
    setSelected(segment);
    setApplied(false);
  };

  const handleClose = () => setOpen(false);

  const handleApplyPromo = () => {
    if (!selected) return;
    try {
      localStorage.setItem("caractere_promo_code", selected.promoCode);
      document.cookie = `caractere_promo_code=${selected.promoCode}; path=/; max-age=${60 * 60 * 24 * 7}`;
    } catch (e) {
      // localStorage indisponible (mode privé etc.) — on continue quand même
    }
    setApplied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-[18rem] overflow-hidden rounded-2xl bg-[#FAF7F0] shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Fermer"
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-stone-700 hover:bg-black/10 transition"
        >
          ✕
        </button>

        {/* Header band with logo */}
        <div className="bg-[#1C1C1A] px-5 pt-5 pb-4 text-center">
          <img
            src={LOGO_URL}
            alt="Caractère Store"
            className="mx-auto h-9 w-auto object-contain"
          />
        </div>

        {/* Countdown */}
        <div className="bg-[#B8722E] py-1.5 text-center text-[11px] font-semibold tracking-wide text-white">
          Offre valable {formatTime(secondsLeft)}
        </div>

        <div className="px-5 py-5">
          {!selected ? (
            <>
              <h2 className="text-center text-base font-semibold leading-snug text-stone-900">
                Vous avez débloqué
                <br />
                <span className="text-[#B8722E]">-15% de réduction</span>
              </h2>
              <p className="mt-1.5 text-center text-xs text-stone-600">
                Dites-nous ce que vous cherchez pour récupérer votre code :
              </p>

              <div className="mt-4 flex flex-col gap-2">
                {SEGMENTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(s)}
                    className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-left text-xs font-medium text-stone-800 transition hover:border-[#1C1C1A] hover:bg-stone-50"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleClose}
                className="mt-4 w-full text-center text-[11px] text-stone-400 underline hover:text-stone-600"
              >
                Non merci, je ne veux pas de réduction
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <span className="mb-2 text-xl">✨</span>
              <h2 className="text-sm font-semibold text-stone-900">
                {selected.resultTitle}
              </h2>
              <p className="mt-1.5 text-xs text-stone-600">
                {selected.resultBody}
              </p>

              <div className="mt-4 w-full rounded-xl border-2 border-dashed border-[#B8722E] bg-[#FFF6EA] py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-stone-500">
                  Votre code
                </p>
                <p className="text-lg font-bold tracking-widest text-[#B8722E]">
                  {selected.promoCode}
                </p>
              </div>

              {!applied ? (
                <button
                  onClick={handleApplyPromo}
                  className="mt-4 w-full rounded-full bg-[#1C1C1A] py-2.5 text-xs font-semibold text-[#E8DCC0] transition hover:bg-stone-800"
                >
                  Appliquer le code promo
                </button>
              ) : (
                <>
                  <p className="mt-4 text-xs font-medium text-green-700">
                    ✓ Code appliqué — {selected.discount} de réduction activée
                  </p>
                  <a
                    href={`${selected.redirectUrl}?promo=${selected.promoCode}`}
                    className="mt-3 w-full rounded-full bg-[#1C1C1A] py-2.5 text-xs font-semibold text-[#E8DCC0] transition hover:bg-stone-800"
                  >
                    Voir les produits
                  </a>
                </>
              )}

              <button
                onClick={() => setSelected(null)}
                className="mt-3 text-[11px] text-stone-400 underline hover:text-stone-600"
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
