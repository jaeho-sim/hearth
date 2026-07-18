import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { useCurrentHousehold } from '@/context/HouseholdContext';
import { signOut } from '@/services/authService';

const MENU: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; screen: string }[] = [
  { key: 'members', label: 'Household members', icon: 'people-outline', screen: 'HouseholdMembers' },
  { key: 'household', label: 'Household settings', icon: 'home-outline', screen: 'EditHousehold' },
  { key: 'categories', label: 'Manage categories', icon: 'grid-outline', screen: 'CategoryManager' },
];

export function SettingsScreen() {
  const { profile } = useAuth();
  const { household } = useCurrentHousehold();
  const navigation = useNavigation<any>();

  if (!profile) return null;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar name={profile.displayName} uri={profile.photoURL} size={52} />
        <View style={{ marginLeft: spacing.md }}>
          <Text style={typography.h3}>{profile.displayName}</Text>
          <Text style={typography.caption}>{profile.email}</Text>
        </View>
      </View>

      {household && <Text style={[typography.label, { marginTop: spacing.lg }]}>{household.name.toUpperCase()}</Text>}

      <View style={{ marginTop: spacing.sm, gap: spacing.sm }}>
        {MENU.map((item) => (
          <Card key={item.key} style={styles.row} onPress={() => navigation.navigate(item.screen)}>
            <Ionicons name={item.icon} size={20} color={colors.primary} />
            <Text style={[typography.body, { flex: 1, marginLeft: spacing.sm }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
          </Card>
        ))}
      </View>

      <Button title="Sign out" variant="ghost" onPress={() => signOut()} style={{ marginTop: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
});
