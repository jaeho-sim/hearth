import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

export function ScreenContainer({
  children,
  style,
  padded = true,
}: PropsWithChildren<{ style?: ViewStyle; padded?: boolean }>) {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={[padded && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  padded: { flex: 1, paddingHorizontal: spacing.lg },
});
