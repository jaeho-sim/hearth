import React, { createContext, PropsWithChildren, useContext } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useHousehold } from '@/hooks/useHousehold';
import { Household } from '@/types/models';

interface HouseholdContextValue {
  household: Household | null;
  loading: boolean;
}

const HouseholdContext = createContext<HouseholdContextValue>({ household: null, loading: true });

export function HouseholdProvider({ children }: PropsWithChildren) {
  const { profile } = useAuth();
  const value = useHousehold(profile?.householdId);
  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>;
}

export function useCurrentHousehold() {
  return useContext(HouseholdContext);
}
