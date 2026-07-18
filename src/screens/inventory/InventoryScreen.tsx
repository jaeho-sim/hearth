import React from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { InventoryRow } from '@/components/InventoryRow';
import { spacing } from '@/theme';
import { useCurrentHousehold } from '@/context/HouseholdContext';
import { useInventoryByCategory } from '@/hooks/useInventory';
import { InventoryStackParamList } from '@/navigation/types';

export function InventoryScreen({ route }: { route: { params: { categoryId: string; categoryName: string } } }) {
  const { categoryId, categoryName } = route.params;
  const { household } = useCurrentHousehold();
  const { items, loading } = useInventoryByCategory(household?.id, categoryId);
  const navigation = useNavigation<NativeStackNavigationProp<InventoryStackParamList>>();

  return (
    <ScreenContainer>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xxl, flexGrow: 1 }}
        renderItem={({ item }) => (
          <InventoryRow
            item={item}
            onPress={() => navigation.navigate('AddEditItem', { categoryId, itemId: item.id })}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="file-tray-stacked-outline"
              title={`Nothing in ${categoryName} yet`}
              subtitle="Tap the + button to add your first item."
            />
          ) : null
        }
      />
      <FAB onPress={() => navigation.navigate('AddEditItem', { categoryId })} />
    </ScreenContainer>
  );
}
