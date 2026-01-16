export type EntitlementLike = {
  plan?: string | null;
  status: string | null;
  expires_at: string | null;
  trial_ends_at: string | null;
};

export function computeCanUseApp(ent: EntitlementLike): boolean {
  const nowMs = Date.now();
  const trialEndsMs = ent.trial_ends_at
    ? new Date(ent.trial_ends_at).getTime()
    : null;
  const expiresMs = ent.expires_at ? new Date(ent.expires_at).getTime() : null;
  const isTrial = trialEndsMs !== null && trialEndsMs > nowMs;
  const isPaidLike = ent.status === "active" || ent.status === "trialing";
  const isPaidActive = isPaidLike && (expiresMs === null || expiresMs > nowMs);

  // Strict check: Only Active Paid subscription or Valid Trial allowed.
  return isTrial || isPaidActive;
}
