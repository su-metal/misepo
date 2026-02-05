
export const PLAN_NAMES = {
  ENTRY: "entry",
  STANDARD: "standard",
  PROFESSIONAL: "professional",
} as const;

export function getPlanFromPriceId(priceId: string): string | null {
  const ENTRY_ID = process.env.STRIPE_PRICE_MONTHLY_EARLY_BIRD_ID;
  const STANDARD_ID = process.env.STRIPE_PRICE_MONTHLY_STANDARD_ID;
  const PROFESSIONAL_ID = process.env.STRIPE_PRICE_MONTHLY_ID;

  if (priceId === ENTRY_ID) return PLAN_NAMES.ENTRY;
  if (priceId === STANDARD_ID) return PLAN_NAMES.STANDARD;
  if (priceId === PROFESSIONAL_ID) return PLAN_NAMES.PROFESSIONAL;

  return null;
}
