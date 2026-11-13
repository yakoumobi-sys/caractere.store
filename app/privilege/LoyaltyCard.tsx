"use client";

import { useEffect, useRef, useState } from "react";
import { filledLoyaltyDots, LOYALTY_CARD_DOTS } from "@/lib/privilege-card";

type Props = {
  name: string;
  joinedAt: string;
  purchaseCount: number;
};

/**
 * Les ronds gagnés sont calculés à partir des achats réellement crédités.
 * À l'ouverture, la carte apparaît puis les coches se révèlent l'une après
 * l'autre. Si le client reçoit un autre achat sans quitter la page, seuls
 * les nouveaux ronds s'animent. Aucun point n'est modifiable depuis le client.
 */
export default function LoyaltyCard({ name, joinedAt, purchaseCount }: Props) {
  const targetDots = filledLoyaltyDots(purchaseCount);
  const [visibleDots, setVisibleDots] = useState(0);
  const previousTarget = useRef(0);
  const remainingPurchases = Math.ceil((LOYALTY_CARD_DOTS - targetDots) / 3);

  useEffect(() => {
    const from = Math.min(previousTarget.current, targetDots);
    previousTarget.current = targetDots;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || targetDots <= from) {
      setVisibleDots(targetDots);
      return;
    }

    setVisibleDots(from);
    const timers: number[] = [];
    for (let dot = from + 1; dot <= targetDots; dot += 1) {
      const number = dot;
      timers.push(window.setTimeout(() => setVisibleDots(number), 750 + (dot - from - 1) * 230));
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [targetDots]);

  const created = new Date(joinedAt).toLocaleDateString("fr-DZ", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="privilege-premium-card relative isolate min-h-[350px] overflow-hidden rounded-[30px] p-6 text-white shadow-[0_26px_70px_rgba(35,24,19,0.24)] sm:p-9">
      <div className="privilege-card-grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#c88e67]/[0.12] blur-3xl" aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.34em] text-[#ebc7ac]">ÉDITION PRIVILÈGE</p>
          <p className="mt-2 text-[25px] font-black tracking-[-.07em] sm:text-[30px]">CARACTÈRE<span className="text-[#e9a57f]">.</span></p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ddb99d]/40 bg-[#d8a782]/10 text-2xl text-[#f7d2ae]">✦</span>
      </div>

      <div className="relative mt-8">
        <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-white/50">CARTE PERSONNELLE</p>
        <h2 className="mt-2 break-words text-[clamp(1.6rem,4vw,2.3rem)] font-semibold leading-tight tracking-[-.045em]">{name}</h2>
        <p className="mt-2 text-xs text-[#c6b5ac]">Membre depuis {created}</p>
      </div>

      <div className="relative mt-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-[#ead5c5]">Mes achats récompensés</span>
          <span className="text-sm font-bold tabular-nums text-[#f1c19d]">{visibleDots}<span className="text-white/50"> / 10</span></span>
        </div>
        <div
          className="grid grid-cols-5 gap-2.5 sm:grid-cols-10 sm:gap-2"
          role="progressbar"
          aria-label="Ronds de fidélité cochés"
          aria-valuemin={0}
          aria-valuemax={LOYALTY_CARD_DOTS}
          aria-valuenow={targetDots}
          aria-valuetext={targetDots + " ronds cochés sur 10"}
        >
          {Array.from({ length: LOYALTY_CARD_DOTS }, (_, index) => {
            const checked = index < visibleDots;
            return (
              <span
                key={index}
                className={"privilege-loyalty-dot flex aspect-square min-h-[36px] items-center justify-center rounded-full " + (checked ? "privilege-loyalty-dot-checked" : "privilege-loyalty-dot-empty")}
                aria-hidden="true"
              >
                {checked && (
                  <svg viewBox="0 0 24 24" fill="none" className="h-[55%] w-[55%]" aria-hidden="true">
                    <path d="M5 12.5L10 17L19 7" stroke="#35201A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-white/10 pt-4">
          <p className="max-w-[320px] text-xs leading-relaxed text-[#c8b8ae]">
            {targetDots === 0
              ? "Au premier achat validé, 3 ronds se cocheront sur votre carte."
              : targetDots === LOYALTY_CARD_DOTS
                ? "Bravo ! Votre carte est complète. Contactez Caractère pour connaître vos avantages."
                : "Encore " + remainingPurchases + " achat" + (remainingPurchases > 1 ? "s" : "") + " validé" + (remainingPurchases > 1 ? "s" : "") + " pour compléter votre carte."}
          </p>
          <span className="rounded-full border border-[#eac7ad]/25 bg-[#f5d0b4]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-[#f0c29d]">
            +3 ronds / achat
          </span>
        </div>
      </div>
    </div>
  );
}
