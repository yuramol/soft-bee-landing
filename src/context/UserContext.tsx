'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

import { createBrowserClient } from '@/utils/supabase/client';

export interface User {
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function readStringMetadata(meta: SupabaseUser['user_metadata'], key: string): string | undefined {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
    return undefined;
  }
  if (!(key in meta)) {
    return undefined;
  }
  const value = (meta as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : undefined;
}

function mapSupabaseUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) {
    return null;
  }

  const meta = supabaseUser.user_metadata;
  const name =
    (meta ? (readStringMetadata(meta, 'full_name') ?? readStringMetadata(meta, 'name')) : undefined) ||
    supabaseUser.email?.split('@')[0] ||
    'User';

  return {
    name,
    email: supabaseUser.email ?? ''
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createBrowserClient(), []);

  useEffect(() => {
    function applyUserFromSession(next: SupabaseUser | null) {
      setUser(mapSupabaseUser(next));
      setIsAuth(next !== null);
      setIsLoading(false);
    }

    let cancelled = false;
    let authSubscription: { unsubscribe: () => void } | undefined;

    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) {
        return;
      }
      applyUserFromSession(data.user);

      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (cancelled) {
          return;
        }
        applyUserFromSession(session?.user ?? null);
      });
      authSubscription = subscription;
      if (cancelled) {
        subscription.unsubscribe();
      }
    })();

    return () => {
      cancelled = true;
      authSubscription?.unsubscribe();
    };
  }, [supabase]);

  async function logout() {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsAuth(false);
    setIsLoading(false);
  }

  return <UserContext.Provider value={{ user, isAuth, isLoading, logout }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
