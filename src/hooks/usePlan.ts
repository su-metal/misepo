import { useState, useCallback, useEffect } from 'react';
import { UserPlan } from '../types';

export function usePlan(user: any) {
  const [plan, setPlan] = useState<UserPlan>({
    isPro: false,
    canUseApp: true,
    eligibleForTrial: true,
    plan: 'free',
    status: 'active',
    trial_ends_at: null,
    usage: 0,
    limit: 0,
    usage_period: 'daily'
  });
  const [loading, setLoading] = useState(false);

  const refreshPlan = useCallback(async (loggedInOverride?: boolean) => {
    const isLoggedIn = loggedInOverride !== undefined ? loggedInOverride : !!user;
    if (!isLoggedIn) {
      setPlan({ isPro: false, canUseApp: true, eligibleForTrial: true, plan: 'free', status: 'active', trial_ends_at: null, usage: 0, limit: 0, usage_period: 'daily' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/me/plan?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPlan({
          isPro: !!data.isPro,
          canUseApp: !!data.canUseApp,
          eligibleForTrial: !!data.eligibleForTrial,
          plan: data.plan,
          status: data.status,
          trial_ends_at: data.trial_ends_at,
          usage: data.usage,
          limit: data.limit,
          usage_period: data.usage_period
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
