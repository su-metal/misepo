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
  const isTrialActive = ent.plan === 'trial' && ent.status === 'active' && trialEndsMs !== null && trialEndsMs > nowMs;
  const isPaidLike = ent.status === "active" || ent.status === "trialing";
  const isPaidActive = ent.plan !== 'trial' && isPaidLike && (expiresMs === null || expiresMs > nowMs);

  return isTrialActive || isPaidActive;
}
