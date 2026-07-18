import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { Stepper } from '@/components/Stepper';
import { typography, spacing } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { useCurrentHousehold } from '@/context/HouseholdContext';
import { addShoppingItem } from '@/services/shoppingListService';

export function AddEditShoppingItemScreen() {
  const navigation = useNavigation();
  const { profile } = useAuth();
  const { household } = useCurrentHousehold();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!household || !profile || !name.trim()) return;
    setSaving(true);
    try {
      await addShoppingItem(household.id, {
        name: name.trim(),
        quantity,
        unit: unit.trim() || undefined,
        notes: notes.trim() || undefined,
        categoryId: null,
        addedBy: profile.uid,
        addedByName: profile.displayName,
      });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={typography.h2}>Add to shopping list</Text>
        <TextField label="Item" placeholder="e.g. Paper towels" value={name} onChangeText={setName} autoFocus style={{ marginTop: spacing.lg }} />
        <Text style={typography.label}>Quantity</Text>
        <View style={{ marginTop: spacing.xs, marginBottom: spacing.md }}>
          <Stepper value={quantity} onChange={setQuantity} min={1} />
        </View>
        <TextField label="Unit (optional)" placeholder="pcs, rolls..." value={unit} onChangeText={setUnit} />
        <TextField label="Notes (optional)" placeholder="Brand, store, etc." value={notes} onChangeText={setNotes} multiline numberOfLines={3} />
        <Button title="Add to list" onPress={handleSave} loading={saving} disabled={!name.trim()} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </ScreenContainer>
  );
}
