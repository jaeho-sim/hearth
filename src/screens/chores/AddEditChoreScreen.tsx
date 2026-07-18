import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '@/config/firebase';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { typography, spacing } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { useCurrentHousehold } from '@/context/HouseholdContext';
import { addChore, deleteChore, updateChore } from '@/services/choresService';
import { formatDate } from '@/utils/date';
import { Chore, RecurrenceFrequency } from '@/types/models';

const FREQUENCIES: { key: RecurrenceFrequency; label: string }[] = [
  { key: 'none', label: 'One-time' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

export function AddEditChoreScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { choreId } = route.params as { choreId?: string };
  const { profile } = useAuth();
  const { household } = useCurrentHousehold();
  const isEditing = !!choreId;

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState(Date.now());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('none');
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const members = household ? Object.values(household.members).filter(Boolean) : [];

  useEffect(() => {
    if (!household || !choreId) return;
    getDoc(doc(db, 'households', household.id, 'chores', choreId)).then((snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as Chore;
      setTitle(data.title);
      setNotes(data.notes ?? '');
      setDueDate(data.dueDate);
      setFrequency(data.recurrence.frequency);
      setAssignedTo(data.assignedTo ?? null);
    });
  }, [household, choreId]);

  async function handleSave() {
    if (!household || !profile || !title.trim()) return;
    setSaving(true);
    try {
      const assignee = members.find((m) => m.uid === assignedTo);
      const payload = {
        title: title.trim(),
        notes: notes.trim() || undefined,
        dueDate,
        recurrence: { frequency, interval: 1 },
        assignedTo: assignedTo ?? null,
        assignedToName: assignee?.displayName ?? null,
        createdBy: profile.uid,
      };
      if (isEditing && choreId) {
        await updateChore(household.id, choreId, payload);
      } else {
        await addChore(household.id, payload);
      }
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    if (!household || !choreId) return;
    Alert.alert('Delete chore', `Delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteChore(household.id, choreId);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={typography.h2}>{isEditing ? 'Edit chore' : 'New chore'}</Text>

        <TextField label="Title" placeholder="e.g. Take out trash" value={title} onChangeText={setTitle} autoFocus={!isEditing} style={{ marginTop: spacing.lg }} />

        <Text style={typography.label}>Due date</Text>
        <Button title={formatDate(dueDate)} variant="secondary" onPress={() => setShowDatePicker(true)} style={{ marginTop: spacing.xs, marginBottom: spacing.md, alignSelf: 'flex-start' }} />
        {showDatePicker && (
          <DateTimePicker
            value={new Date(dueDate)}
            mode="date"
            onChange={(_, date) => {
              setShowDatePicker(false);
              if (date) setDueDate(date.getTime());
            }}
          />
        )}

        <Text style={typography.label}>Repeats</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs, marginBottom: spacing.md }}>
          {FREQUENCIES.map((f) => (
            <Chip key={f.key} label={f.label} selected={frequency === f.key} onPress={() => setFrequency(f.key)} />
          ))}
        </View>

        {members.length > 0 && (
          <>
            <Text style={typography.label}>Assign to</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs, marginBottom: spacing.md }}>
              <Chip label="Anyone" selected={!assignedTo} onPress={() => setAssignedTo(null)} />
              {members.map((m) => (
                <Chip key={m.uid} label={m.displayName.split(' ')[0]} selected={assignedTo === m.uid} onPress={() => setAssignedTo(m.uid)} />
              ))}
            </View>
          </>
        )}

        <TextField label="Notes (optional)" value={notes} onChangeText={setNotes} multiline numberOfLines={3} />

        <Button title="Save" onPress={handleSave} loading={saving} disabled={!title.trim()} style={{ marginTop: spacing.md }} />
        {isEditing && <Button title="Delete chore" variant="danger" onPress={confirmDelete} style={{ marginTop: spacing.sm, marginBottom: spacing.xl }} />}
      </ScrollView>
    </ScreenContainer>
  );
}
