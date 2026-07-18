import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({ title, onPress, variant = 'primary', disabled, loading, style, icon }: Props) {
  const palette = variantStyles[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        pressed && !disabled && { opacity: 0.85 },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: palette.text }, icon ? { marginLeft: spacing.xs } : null]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const variantStyles: Record<Variant, { bg: string; border: string; text: string }> = {
  primary: { bg: colors.primary, border: colors.primary, text: colors.white },
  secondary: { bg: colors.primaryMuted, border: colors.primaryMuted, text: colors.primary },
  ghost: { bg: 'transparent', border: colors.border, text: colors.text },
  danger: { bg: colors.dangerMuted, border: colors.dangerMuted, text: colors.danger },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  text: { ...typography.h3, fontSize: 15 },
  disabled: { opacity: 0.5 },
});
