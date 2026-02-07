import { useState, useCallback, useEffect } from 'react';
import { UserPlan } from '../types';

export function usePlan(user: any) {
  const [plan, setPlan] = useState<UserPlan>({
    isPro: false,
    canUseApp: false,
    eligibleForTrial: true,
    plan: 'none',
    status: 'inactive',
    trial_ends_at: null,
    usage: 0,
    limit: 0,
    usage_period: 'daily'
  });
  const [loading, setLoading] = useState(false);

  const refreshPlan = useCallback(async (loggedInOverride?: boolean) => {
    const isLoggedIn = loggedInOverride !== undefined ? loggedInOverride : !!user;
    if (!isLoggedIn) {
      setPlan({ isPro: false, canUseApp: true, eligibleForTrial: true, plan: 'none', status: 'inactive', trial_ends_at: null, usage: 0, limit: 0, usage_period: 'daily' });
      return;
    }

    setLoading(true);
    try {
      let res;
      let lastError;
      
      // Simple retry logic: try up to 2 times
      for (let i = 0; i < 2; i++) {
        try {
          res = await fetch(`/api/me/plan?t=${Date.now()}`, { cache: 'no-store' });
          if (res.ok) break; // Success
        } catch (e) {
          lastError = e;
          // Wait 1s before retry if it's the first attempt
          if (i === 0) await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!res || !res.ok) {
        throw lastError || new Error(`Fetch failed: ${res?.status}`);
      }

      const data = await res.json();
      if (data.ok) {
        const newPlan = {
          isPro: !!data.isPro,
          canUseApp: !!data.canUseApp,
          eligibleForTrial: !!data.eligibleForTrial,
          plan: data.plan,
          status: data.status,
          trial_ends_at: data.trial_ends_at,
          usage: data.usage,
          limit: data.limit,
          usage_period: data.usage_period
        };
        setPlan(newPlan);
        return newPlan;
      }
    } catch (err) {
      // Downgrade to warn to avoid cluttering error monitoring for network flakes
      console.warn('Failed to fetch plan:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshPlan();
  }, [refreshPlan]);

  return { plan, loading, refreshPlan };
}
