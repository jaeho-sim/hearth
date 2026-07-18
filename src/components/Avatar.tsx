import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '@/theme';

export function Avatar({ name, uri, size = 36 }: { name: string; uri?: string | null; size?: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: radii.pill }} />;
  }
  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: radii.pill }]}>
      <Text style={{ color: colors.primary, fontWeight: '700', fontSize: size * 0.38 }}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
});
