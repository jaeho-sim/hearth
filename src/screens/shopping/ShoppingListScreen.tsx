import React, { useMemo } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { colors, spacing, typography } from '@/theme';
import { useCurrentHousehold } from '@/context/HouseholdContext';
import { useShoppingList } from '@/hooks/useShoppingList';
import { deleteShoppingItem, toggleShoppingItem } from '@/services/shoppingListService';
import { ShoppingListItem } from '@/types/models';

export function ShoppingListScreen() {
  const { household } = useCurrentHousehold();
  const { items, loading } = useShoppingList(household?.id);
  const navigation = useNavigation<any>();

  const sections = useMemo(() => {
    const active = items.filter((i) => !i.checked);
    const checked = items.filter((i) => i.checked);
    return [
      ...(active.length ? [{ title: 'To buy', data: active }] : []),
      ...(checked.length ? [{ title: 'In cart', data: checked }] : []),
    ];
  }, [items]);

  function toggle(item: ShoppingListItem) {
    if (!household) return;
    toggleShoppingItem(household.id, item.id, !item.checked);
  }

  return (
    <ScreenContainer>
      <SectionList
        sections={sections}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xxl, flexGrow: 1 }}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>}
        renderItem={({ item }) => (
          <Card style={styles.row} onPress={() => toggle(item)}>
            <Ionicons
              name={item.checked ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={item.checked ? colors.primary : colors.textFaint}
            />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={[typography.body, item.checked && styles.checkedText]}>
                {item.name} {item.quantity > 1 ? `× ${item.quantity}` : ''}
              </Text>
              {item.notes ? <Text style={typography.caption}>{item.notes}</Text> : null}
            </View>
            <Pressable onPress={() => household && deleteShoppingItem(household.id, item.id)} hitSlop={8}>
              <Ionicons name="close" size={18} color={colors.textFaint} />
            </Pressable>
          </Card>
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="cart-outline" title="Shopping list is empty" subtitle="Add something you need to pick up." />
          ) : null
        }
      />
      <FAB onPress={() => navigation.navigate('AddEditShoppingItem', {})} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { ...typography.label, marginTop: spacing.md, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  checkedText: { textDecorationLine: 'line-through', color: colors.textFaint },
});
