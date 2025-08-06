import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {Session} from '@supabase/supabase-js';
import type {ReactNode} from 'react';

interface UserPayload {
  sub: string;           // User ID
  email?: string;        // User email
  role?: string;         // e.g., 'artist' or 'admin'
  [key: string]: any;    // any additional claims
}

interface AuthContextValue {
  user: UserPayload | null;
  token: string | null;
  supabase: SupabaseClient;
  setUser: (u: UserPayload | null) => void; // kept for backward compatibility
  setToken: (t: string | null) => void;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // initial session
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session: Session | null = data.session;
      if (session) {
        const u = session.user;
        setToken(session.access_token);
        setUser({ sub: u.id, email: u.email || undefined, role: (u.app_metadata as any)?.role || undefined });
        console.log('👑 User-Role im Context:', (u.app_metadata as any)?.role);
        (window as any).supabaseClient = supabase;
      }
    })();

    let subscription: { unsubscribe: () => void } | null = null;
    const { data: listenerData } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession) {
        const u = newSession.user;
        setToken(newSession.access_token);
        setUser({ sub: u.id, email: u.email || undefined, role: (u.app_metadata as any)?.role || undefined });
        console.log('👑 User-Role im Context:', (u.app_metadata as any)?.role);
      } else {
        setToken(null);
        setUser(null);
      }
      (window as any).supabaseClient = supabase;
    });
    if (listenerData && typeof listenerData.subscription?.unsubscribe === 'function') {
      subscription = listenerData.subscription;
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, supabase, setUser, setToken }}>
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