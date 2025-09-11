import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { ReactNode } from 'react';
import { getSupabase as loadSupabase } from '@/lib/supabase';

interface UserPayload {
  sub: string;           // User ID
  email?: string;        // User email
  role?: string;         // e.g., 'artist' or 'admin'
  [key: string]: any;    // any additional claims
}

interface AuthContextValue {
  user: UserPayload | null;
  token: string | null;
  supabase: SupabaseClient | null; // lazily set, may be null initially
  getSupabase: () => Promise<SupabaseClient>; // helper for consumers
  setUser: (u: UserPayload | null) => void; // kept for backward compatibility
  setToken: (t: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);

  async function syncSupabaseProfileWithBackend(client: SupabaseClient, u: { id: string; email?: string }, accessToken: string) {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
      if (!backendUrl || !accessToken || !u?.id) return;

      // 1) Ensure artist exists in backend and get the id
      const res = await fetch(`${backendUrl}/api/artists/me/ensure`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const artist = await res.json();
      if (!res.ok || !artist?.id) {
        console.warn('[Auth] ensure_my_artist failed:', artist);
        return;
      }

      // 2) Upsert profile link in Supabase (user_id -> backend_artist_id)
      const { error: upsertErr } = await client
        .from('profiles')
        .upsert(
          {
            user_id: u.id,                    // adjust to your column name if needed (e.g., id)
            backend_artist_id: artist.id,
            email: u.email ?? null,           // optional convenience fields
            display_name: artist.name ?? null,
          },
          { onConflict: 'user_id' }
        );
      if (upsertErr) console.warn('[Auth] profiles.upsert error:', upsertErr);
    } catch (e) {
      console.error('[Auth] profile sync error:', e);
    }
  }

  useEffect(() => {
    let isMounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    (async () => {
      const client = await loadSupabase();
      if (!isMounted) return;

      // expose for debugging if needed
      (window as any).supabaseClient = client;

      // set client in context
      setSupabaseClient(client);

      // initial session
      const { data } = await client.auth.getSession();
      const session: Session | null = data.session;
      if (session) {
        const u = session.user;
        setToken(session.access_token);
        setUser({ sub: u.id, email: u.email || undefined, role: (u.app_metadata as any)?.role || undefined });
        // sync Supabase profiles with backend artist link on initial session
        syncSupabaseProfileWithBackend(client, { id: u.id, email: u.email ?? undefined }, session.access_token);
      }

      const { data: listenerData } = client.auth.onAuthStateChange((_, newSession) => {
        if (newSession) {
          const u = newSession.user;
          setToken(newSession.access_token);
          setUser({ sub: u.id, email: u.email || undefined, role: (u.app_metadata as any)?.role || undefined });
          // sync profiles link whenever session changes (login/refresh)
          syncSupabaseProfileWithBackend(client, { id: u.id, email: u.email ?? undefined }, newSession.access_token);
        } else {
          setToken(null);
          setUser(null);
        }
        (window as any).supabaseClient = client;
      });

      if (listenerData && typeof listenerData.subscription?.unsubscribe === 'function') {
        subscription = listenerData.subscription;
      }
    })();

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const getSupabase = async (): Promise<SupabaseClient> => {
    if (supabaseClient) return supabaseClient;
    const client = await loadSupabase();
    setSupabaseClient(client);
    return client;
  };

  return (
    <AuthContext.Provider value={{ user, token, supabase: supabaseClient, getSupabase, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}