import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { typography, spacing } from '@/theme';
import { useCurrentHousehold } from '@/context/HouseholdContext';
import { useAuth } from '@/context/AuthContext';
import { renameHousehold, leaveHousehold } from '@/services/householdService';

export function EditHouseholdScreen() {
  const { household } = useCurrentHousehold();
  const { profile } = useAuth();
  const [name, setName] = useState(household?.name ?? '');
  const [saving, setSaving] = useState(false);

  if (!household || !profile) return null;

  async function handleSave() {
    setSaving(true);
    try {
      await renameHousehold(household!.id, name.trim());
    } finally {
      setSaving(false);
    }
  }

  function confirmLeave() {
    Alert.alert('Leave household', `Leave ${household!.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: () => leaveHousehold(household!.id, profile!.uid) },
    ]);
  }

  return (
    <ScreenContainer>
      <Text style={typography.h2}>Household settings</Text>
      <TextField label="Household name" value={name} onChangeText={setName} style={{ marginTop: spacing.lg }} />
      <Button title="Save changes" onPress={handleSave} loading={saving} disabled={!name.trim()} />
      <Button title="Leave household" variant="danger" onPress={confirmLeave} style={{ marginTop: spacing.xl }} />
    </ScreenContainer>
  );
}
