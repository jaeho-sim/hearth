import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { HouseholdProvider, useCurrentHousehold } from '@/context/HouseholdContext';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { CreateOrJoinHouseholdScreen } from '@/screens/onboarding/CreateOrJoinHouseholdScreen';
import { AppTabsNavigator } from '@/navigation/AppTabsNavigator';

function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

function Gate() {
  const { profile } = useAuth();
  const { household, loading } = useCurrentHousehold();

  if (profile?.householdId && loading) return <Loading />;
  if (!profile?.householdId || !household) return <CreateOrJoinHouseholdScreen />;
  return <AppTabsNavigator />;
}

export function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) return <Loading />;

  return (
    <NavigationContainer>
      {!user ? (
        <LoginScreen />
      ) : (
        <HouseholdProvider>
          <Gate />
        </HouseholdProvider>
      )}
    </NavigationContainer>
  );
}
