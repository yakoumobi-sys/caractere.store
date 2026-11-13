/**
 * Caractère Privilège : une carte comporte 10 ronds.
 * Chaque achat vérifié et crédité compte pour 3 ronds, dans la limite de 10.
 * 0 → 0, 1 → 3, 2 → 6, 3 → 9, 4+ → 10.
 * Les points (1 point / 100 DA) restent indépendants.
 */
export const LOYALTY_CARD_DOTS = 10;
export const LOYALTY_DOTS_PER_PURCHASE = 3;

export function filledLoyaltyDots(purchaseCount: number): number {
  const count = Number.isFinite(purchaseCount) ? Math.max(0, Math.floor(purchaseCount)) : 0;
  return Math.min(LOYALTY_CARD_DOTS, count * LOYALTY_DOTS_PER_PURCHASE);
}
