

import React, { createContext, useContext, useState } from 'react';
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
  setUser: (u: UserPayload | null) => void;
  setToken: (t: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>
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