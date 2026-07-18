import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing } from '@/theme';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: 'default' | 'accent' | 'danger';
}

export function Chip({ label, selected, onPress, tone = 'default' }: Props) {
  const palette =
    tone === 'accent'
      ? { bg: colors.accentMuted, text: colors.accent }
      : tone === 'danger'
      ? { bg: colors.dangerMuted, text: colors.danger }
      : { bg: selected ? colors.primary : colors.surfaceMuted, text: selected ? colors.white : colors.textMuted };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { backgroundColor: palette.bg }]}
      disabled={!onPress}
    >
      <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    marginRight: spacing.sm,
  },
  text: { fontSize: 13, fontWeight: '600' },
});
