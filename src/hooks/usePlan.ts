import { useState, useCallback, useEffect } from 'react';

export function usePlan(user: any) {
  const [plan, setPlan] = useState<{
    isPro: boolean;
    canUseApp: boolean;
    eligibleForTrial: boolean;
    plan: string;
    status: string;
    trialEndsAt: string | null;
  }>({
    isPro: false,
    canUseApp: true,
    eligibleForTrial: true,
    plan: 'free',
    status: 'active',
    trialEndsAt: null
  });
  const [loading, setLoading] = useState(false);

  const refreshPlan = useCallback(async (loggedInOverride?: boolean) => {
    const isLoggedIn = loggedInOverride !== undefined ? loggedInOverride : !!user;
    if (!isLoggedIn) {
      setPlan({ isPro: false, canUseApp: true, eligibleForTrial: true, plan: 'free', status: 'active', trialEndsAt: null });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/me/plan', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPlan({
          isPro: !!data.isPro,
          canUseApp: !!data.canUseApp,
          eligibleForTrial: !!data.eligibleForTrial,
          plan: data.plan,
          status: data.status,
          trialEndsAt: data.trial_ends_at
        });
      }
    } catch (err) {
      console.error('Failed to fetch plan:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshPlan();
  }, [refreshPlan]);

  return { plan, loading, refreshPlan };
}
