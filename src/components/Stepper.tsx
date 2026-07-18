import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '@/theme';

export function Stepper({ value, onChange, min = 0 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <View style={styles.row}>
      <Pressable style={styles.btn} onPress={() => onChange(Math.max(min, value - 1))}>
        <Ionicons name="remove" size={18} color={colors.primary} />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable style={styles.btn} onPress={() => onChange(value + 1)}>
        <Ionicons name="add" size={18} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { width: 48, textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.text },
});
