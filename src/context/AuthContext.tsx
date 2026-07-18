import React, { createContext, PropsWithChildren, useContext } from 'react';
import { User } from 'firebase/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { UserProfile } from '@/types/models';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, profile: null, initializing: true });

export function AuthProvider({ children }: PropsWithChildren) {
  const value = useAuthState();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
