import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { Chore } from '@/types/models';
import { formatDate } from '@/utils/date';
import { recurrenceLabel } from '@/utils/recurrence';
import { differenceInCalendarDays } from 'date-fns';

export function ChoreRow({ chore, onToggle, onPress }: { chore: Chore; onToggle: () => void; onPress: () => void }) {
  const overdue = !chore.completed && differenceInCalendarDays(new Date(chore.dueDate), new Date()) < 0;

  return (
    <Card style={styles.row} onPress={onPress}>
      <Ionicons
        name={chore.completed ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={chore.completed ? colors.primary : overdue ? colors.danger : colors.textFaint}
        onPress={onToggle}
      />
      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        <Text style={[typography.body, chore.completed && styles.completedText]}>{chore.title}</Text>
        <View style={styles.metaRow}>
          <Text style={[typography.caption, overdue && { color: colors.danger }]}>
            {overdue ? 'Overdue · ' : ''}
            Due {formatDate(chore.dueDate)}
          </Text>
          {chore.recurrence.frequency !== 'none' && (
            <Text style={typography.caption}> · {recurrenceLabel(chore.recurrence)}</Text>
          )}
          {chore.assignedToName ? <Text style={typography.caption}> · {chore.assignedToName}</Text> : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
  completedText: { textDecorationLine: 'line-through', color: colors.textFaint },
});
