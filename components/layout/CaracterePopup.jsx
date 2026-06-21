"use client";

import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// Config — edit copy, redirects & promo codes here
// ─────────────────────────────────────────────
const SEGMENTS = [
  {
    id: "b2b",
    label: "Je veux des uniformes pour mon entreprise",
    redirectUrl: "/configurateur",
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
    redirectUrl: "/designer",
    promoCode: "POD15",
    discount: "15%",
    resultTitle: "Lancez votre marque sans stock.",
    resultBody:
      "On imprime et on expédie à la demande. Vous vendez, on s'occupe du reste.",
  },
  {
    id: "sample",
    label: "Je veux un échantillon avant de commander en gros",
    redirectUrl: "/configurateur",
    promoCode: "SAMPLE15",
    discount: "15%",
    resultTitle: "Testez la qualité d'abord.",
    resultBody:
      "Commandez un échantillon à prix réduit avant votre commande en gros — zéro risque.",
  },
];

const SHOW_DELAY_MS = 5000;
const COUNTDOWN_SECONDS = 60;
const LOGO_URL =
  "https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png";

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

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

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
      // localStorage indisponible — on continue quand même
    }
    setApplied(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[18rem] overflow-hidden rounded-2xl shadow-2xl"
        style={{
          background: "linear-gradient(165deg, #0C4A6E 0%, #38BDF8 100%)",
        }}
      >
        {/* Halo lumineux, même signature que le hero */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(186,230,253,0.5) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Fermer"
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white transition"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          ✕
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 text-center">
          {/* Logo */}
          <img
            src={LOGO_URL}
            alt="Caractère"
            className="mx-auto h-10 w-auto object-contain"
          />

          {/* Countdown */}
          <div
            className="mx-auto mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-white"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            Offre valable {formatTime(secondsLeft)}
          </div>

          {!selected ? (
            <>
              <h2 className="mt-4 text-base font-extrabold leading-snug text-white">
                Vous avez débloqué
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #BAE6FD, #7DD3FC)",
                  }}
                >
                  -15% de réduction
                </span>
              </h2>
              <p className="mt-1.5 text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
                Dites-nous ce que vous cherchez pour récupérer votre code :
              </p>

              <div className="mt-4 flex flex-col gap-2">
                {SEGMENTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(s)}
                    className="rounded-full border-2 px-4 py-2.5 text-left text-xs font-medium text-white backdrop-blur-sm transition"
                    style={{
                      borderColor: "rgba(255,255,255,0.35)",
                      backgroundColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleClose}
                className="mt-4 w-full text-center text-[11px] underline"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Non merci, je ne veux pas de réduction
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <span className="mt-3 text-xl">✨</span>
              <h2 className="mt-1.5 text-sm font-semibold text-white">
                {selected.resultTitle}
              </h2>
              <p className="mt-1.5 text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
                {selected.resultBody}
              </p>

              <div
                className="mt-4 w-full rounded-xl border-2 border-dashed py-2.5"
                style={{
                  borderColor: "rgba(255,255,255,0.5)",
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.75)" }}>
                  Votre code
                </p>
                <p className="text-lg font-bold tracking-widest text-white">
                  {selected.promoCode}
                </p>
              </div>

              {!applied ? (
                <button
                  onClick={handleApplyPromo}
                  className="mt-4 w-full rounded-full bg-white py-2.5 text-xs font-semibold transition"
                  style={{ color: "#0C4A6E" }}
                >
                  Appliquer le code promo
                </button>
              ) : (
                <>
                  <p className="mt-4 text-xs font-medium" style={{ color: "#86EFAC" }}>
                    ✓ Code appliqué — {selected.discount} de réduction activée
                  </p>
                  <a
                    href={`${selected.redirectUrl}?promo=${selected.promoCode}`}
                    className="mt-3 w-full rounded-full bg-white py-2.5 text-xs font-semibold transition"
                    style={{ color: "#0C4A6E" }}
                  >
                    Voir les produits
                  </a>
                </>
              )}

              <button
                onClick={() => setSelected(null)}
                className="mt-3 text-[11px] underline"
                style={{ color: "rgba(255,255,255,0.6)" }}
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
