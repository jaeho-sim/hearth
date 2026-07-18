import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '@/theme';
import { useCurrentHousehold } from '@/context/HouseholdContext';
import { useCategories } from '@/hooks/useCategories';
import { InventoryScreen } from '@/screens/inventory/InventoryScreen';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';

const TopTabs = createMaterialTopTabNavigator();

export function InventoryTopTabs() {
  const { household } = useCurrentHousehold();
  const { categories, loading } = useCategories(household?.id);
  const navigation = useNavigation<any>();

  if (loading) return null;

  if (categories.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <EmptyState icon="grid-outline" title="No categories yet" subtitle="Create categories like Fridge or Pantry to organize your inventory." />
        <Button title="Manage categories" onPress={() => navigation.navigate('CategoryManager')} style={{ alignSelf: 'center' }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerRow}>
        <Text style={typography.h1}>Inventory</Text>
        <Ionicons name="options-outline" size={22} color={colors.primary} onPress={() => navigation.navigate('CategoryManager')} />
      </View>
      <TopTabs.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarIndicatorStyle: { backgroundColor: colors.primary, height: 3, borderRadius: 3 },
          tabBarLabelStyle: { fontSize: 13, fontWeight: '700', textTransform: 'none' },
          tabBarStyle: { backgroundColor: colors.background, elevation: 0, shadowOpacity: 0 },
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: 'auto', paddingHorizontal: spacing.md },
        }}
      >
        {categories.map((cat) => (
          <TopTabs.Screen
            key={cat.id}
            name={cat.id}
            options={{ title: cat.name }}
            initialParams={{ categoryId: cat.id, categoryName: cat.name }}
            component={InventoryScreen}
          />
        ))}
      </TopTabs.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: colors.background,
  },
});
