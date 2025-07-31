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
    supabase.auth.getSession().then(({ data }) => {
      const session: Session | null = data.session;
      if (session) {
        const u = session.user;
        setToken(session.access_token);
        setUser({ sub: u.id, email: u.email || undefined, role: (u.user_metadata as any)?.role || undefined });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession) {
        const u = newSession.user;
        setToken(newSession.access_token);
        setUser({ sub: u.id, email: u.email || undefined, role: (u.user_metadata as any)?.role || undefined });
      } else {
        setToken(null);
        setUser(null);
      }
    });
    return () => {
      subscription?.unsubscribe();
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