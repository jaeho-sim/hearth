import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { InventoryItem } from '@/types/models';
import { expiryLabel } from '@/utils/date';

export function InventoryRow({ item, onPress }: { item: InventoryItem; onPress: () => void }) {
  const expiry = expiryLabel(item.expirationDate);
  const low = item.lowStockThreshold != null && item.quantity <= item.lowStockThreshold;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={typography.h3}>{item.name}</Text>
        <View style={styles.metaRow}>
          <Text style={typography.bodyMuted}>
            {item.quantity} {item.unit ?? ''}
          </Text>
          {expiry && (
            <View style={[styles.badge, badgeTone[expiry.tone]]}>
              <Text style={[styles.badgeText, badgeTextTone[expiry.tone]]}>{expiry.label}</Text>
            </View>
          )}
          {low && (
            <View style={[styles.badge, { backgroundColor: colors.dangerMuted }]}>
              <Text style={[styles.badgeText, { color: colors.danger }]}>Low stock</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

const badgeTone = {
  ok: { backgroundColor: colors.surfaceMuted },
  soon: { backgroundColor: colors.accentMuted },
  expired: { backgroundColor: colors.dangerMuted },
};
const badgeTextTone = {
  ok: { color: colors.textMuted },
  soon: { color: colors.accent },
  expired: { color: colors.danger },
};

const styles = StyleSheet.create({
  card: { marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: spacing.sm, flexWrap: 'wrap' },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '600' },
});
