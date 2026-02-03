import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    init();

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (_event === 'SIGNED_OUT') {
      setUser(null);
    } else if (session) {
      setUser(session.user);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}, [supabase]);

  const loginWithGoogle = async (intent: string = 'login') => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('login_intent');
    }
    // Force sign out first to ensure account selection works
    await supabase.auth.signOut();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?intent=${intent}&next=/generate`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
  };

  const logout = async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('login_intent');
    }
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return { user, loading, loginWithGoogle, logout };
}
