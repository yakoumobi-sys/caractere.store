"use client";

import { useEffect, useRef, useState } from "react";
import { filledLoyaltyDots, LOYALTY_CARD_DOTS } from "@/lib/privilege-card";

type Props = {
  name: string;
  joinedAt: string;
  purchaseCount: number;
  cardNumber?: string;
  delivered?: boolean;
};

/**
 * Les ronds gagnés sont calculés à partir des achats réellement crédités.
 * À l'ouverture, la carte apparaît puis les coches se révèlent l'une après
 * l'autre. Si le client reçoit un autre achat sans quitter la page, seuls
 * les nouveaux ronds s'animent. Aucun point n'est modifiable depuis le client.
 */
export default function LoyaltyCard({ name, joinedAt, purchaseCount, cardNumber, delivered = false }: Props) {
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
    <div className="privilege-premium-card relative isolate flex aspect-[1.586] min-h-[220px] flex-col justify-between overflow-hidden rounded-[22px] p-4 text-white shadow-[0_26px_70px_rgba(35,24,19,0.24)] sm:p-6">
      <div className="privilege-card-grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#c88e67]/[0.12] blur-3xl" aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.34em] text-[#ebc7ac]">ÉDITION PRIVILÈGE</p>
          <p className="mt-2 text-[25px] font-black tracking-[-.07em] sm:text-[30px]">CARACTÈRE<span className="text-[#e9a57f]">.</span></p>
        </div>
        <svg aria-hidden="true" viewBox="0 0 58 44" className="h-9 w-12 shrink-0 sm:h-11 sm:w-[58px]"><rect x="1" y="1" width="56" height="42" rx="9" fill="#d5b17e" stroke="#f2d5a2"/><path d="M19 1v12l8 9-8 9v12M39 1v12l-8 9 8 9v12M1 15h16M1 29h16M41 15h16M41 29h16M27 22h4" stroke="#80613f" fill="none" strokeWidth="1.3"/></svg>
      </div>

      <div className="relative mt-4">
        <p className="text-[9px] font-semibold uppercase tracking-[.24em] text-white/50">{cardNumber ? "•••• •••• " + cardNumber : "CARTE PERSONNELLE"}</p>
        <h2 className="mt-1 break-words text-[clamp(1rem,3.8vw,1.7rem)] font-semibold leading-tight tracking-[-.045em]">{name}</h2>
        <p className="mt-2 text-xs text-[#c6b5ac]">Membre depuis {created}</p>
      </div>

      <div className="relative mt-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-[#ead5c5]">Mes achats récompensés</span>
          <span className="text-sm font-bold tabular-nums text-[#f1c19d]">{visibleDots}<span className="text-white/50"> / 10</span></span>
        </div>
        <div
          className="grid grid-cols-10 gap-1.5"
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
                className={"privilege-loyalty-dot flex aspect-square min-h-0 items-center justify-center rounded-full " + (checked ? "privilege-loyalty-dot-checked" : "privilege-loyalty-dot-empty")}
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
        <div className="mt-3 flex items-end justify-between gap-2 border-t border-white/10 pt-2">
          <p className="max-w-[320px] text-xs leading-relaxed text-[#c8b8ae]">
            {delivered ? "Récompense remise : 5 T-shirts." : targetDots === 0
              ? "Au premier achat validé, 3 ronds se cocheront sur votre carte."
              : targetDots === LOYALTY_CARD_DOTS
                ? (cardNumber ? "Bravo ! 5 T-shirts offerts." : "Bravo ! Votre carte est complète.")
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
