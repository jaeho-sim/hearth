import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useCurrentHousehold } from '@/context/HouseholdContext';
import { useCategories } from '@/hooks/useCategories';
import { addCategory, deleteCategory } from '@/services/categoryService';

export function CategoryManagerScreen() {
  const { household } = useCurrentHousehold();
  const { categories } = useCategories(household?.id);
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (!household || !name.trim()) return;
    setAdding(true);
    try {
      await addCategory(household.id, name.trim(), 'home-outline', categories.length);
      setName('');
    } finally {
      setAdding(false);
    }
  }

  function confirmDelete(id: string, catName: string) {
    Alert.alert('Delete category', `Delete "${catName}"? Items inside won't be deleted but will be hidden until moved.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => household && deleteCategory(household.id, id) },
    ]);
  }

  return (
    <ScreenContainer>
      <Text style={typography.h2}>Categories</Text>
      <Text style={[typography.bodyMuted, { marginTop: spacing.xs }]}>These show up as tabs on the Inventory screen.</Text>

      <View style={styles.addRow}>
        <TextField placeholder="New category name" value={name} onChangeText={setName} style={{ flex: 1, marginBottom: 0 }} />
      </View>
      <Button title="Add category" onPress={handleAdd} loading={adding} disabled={!name.trim()} style={{ marginTop: spacing.sm }} />

      <FlatList
        data={categories}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ gap: spacing.sm, marginTop: spacing.lg, paddingBottom: spacing.xl }}
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <Ionicons name={item.icon as any} size={20} color={colors.primary} />
            <Text style={[typography.body, { flex: 1, marginLeft: spacing.sm }]}>{item.name}</Text>
            <Ionicons name="trash-outline" size={20} color={colors.textFaint} onPress={() => confirmDelete(item.id, item.name)} />
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  addRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center' },
});
