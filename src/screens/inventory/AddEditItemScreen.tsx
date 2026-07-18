import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '@/config/firebase';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { Stepper } from '@/components/Stepper';
import { typography, spacing, colors } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { useCurrentHousehold } from '@/context/HouseholdContext';
import { addInventoryItem, deleteInventoryItem, updateInventoryItem } from '@/services/inventoryService';
import { formatDate } from '@/utils/date';
import { InventoryItem } from '@/types/models';

export function AddEditItemScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { categoryId, itemId } = route.params as { categoryId: string; itemId?: string };
  const { profile } = useAuth();
  const { household } = useCurrentHousehold();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('');
  const [expirationDate, setExpirationDate] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const isEditing = !!itemId;

  useEffect(() => {
    if (!household || !itemId) return;
    getDoc(doc(db, 'households', household.id, 'inventory', itemId)).then((snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as InventoryItem;
      setName(data.name);
      setQuantity(data.quantity);
      setUnit(data.unit ?? '');
      setExpirationDate(data.expirationDate ?? null);
      setLowStockThreshold(data.lowStockThreshold != null ? String(data.lowStockThreshold) : '');
      setNotes(data.notes ?? '');
    });
  }, [household, itemId]);

  async function handleSave() {
    if (!household || !profile || !name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        categoryId,
        name: name.trim(),
        quantity,
        unit: unit.trim() || undefined,
        expirationDate,
        notes: notes.trim() || undefined,
        lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : null,
        addedBy: profile.uid,
        addedByName: profile.displayName,
      };
      if (isEditing && itemId) {
        await updateInventoryItem(household.id, itemId, payload);
      } else {
        await addInventoryItem(household.id, payload);
      }
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    if (!household || !itemId) return;
    Alert.alert('Delete item', `Remove "${name}" from inventory?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteInventoryItem(household.id, itemId);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={typography.h2}>{isEditing ? 'Edit item' : 'Add item'}</Text>

        <TextField label="Name" placeholder="e.g. Milk" value={name} onChangeText={setName} style={{ marginTop: spacing.lg }} autoFocus={!isEditing} />

        <Text style={typography.label}>Quantity</Text>
        <View style={{ marginTop: spacing.xs, marginBottom: spacing.md }}>
          <Stepper value={quantity} onChange={setQuantity} min={0} />
        </View>

        <TextField label="Unit (optional)" placeholder="pcs, lbs, boxes..." value={unit} onChangeText={setUnit} />

        <Text style={typography.label}>Expiration date (optional)</Text>
        <Button
          title={expirationDate ? formatDate(expirationDate) : 'Set expiration date'}
          variant="secondary"
          onPress={() => setShowDatePicker(true)}
          style={{ marginTop: spacing.xs, marginBottom: spacing.md, alignSelf: 'flex-start' }}
        />
        {expirationDate && (
          <Button title="Clear date" variant="ghost" onPress={() => setExpirationDate(null)} style={{ marginTop: -spacing.sm, marginBottom: spacing.md, alignSelf: 'flex-start' }} />
        )}
        {showDatePicker && (
          <DateTimePicker
            value={expirationDate ? new Date(expirationDate) : new Date()}
            mode="date"
            onChange={(_, date) => {
              setShowDatePicker(false);
              if (date) setExpirationDate(date.getTime());
            }}
          />
        )}

        <TextField
          label="Low stock alert threshold (optional)"
          placeholder="e.g. 1"
          value={lowStockThreshold}
          onChangeText={setLowStockThreshold}
          keyboardType="number-pad"
        />

        <TextField label="Notes (optional)" placeholder="Brand, location, etc." value={notes} onChangeText={setNotes} multiline numberOfLines={3} />

        <Button title="Save" onPress={handleSave} loading={saving} disabled={!name.trim()} style={{ marginTop: spacing.md }} />
        {isEditing && <Button title="Delete item" variant="danger" onPress={confirmDelete} style={{ marginTop: spacing.sm, marginBottom: spacing.xl }} />}
      </ScrollView>
    </ScreenContainer>
  );
}
