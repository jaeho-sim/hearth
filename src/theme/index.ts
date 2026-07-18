/**
 * Hearth design system.
 * Simple, clean, modern: warm neutral background, single sage accent,
 * soft cards, generous spacing, rounded corners.
 */

export const colors = {
  background: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceMuted: '#F1EEE7',
  border: '#E7E2D8',
  text: '#2B2A27',
  textMuted: '#726F68',
  textFaint: '#A6A29A',
  primary: '#5B7A63', // sage green
  primaryMuted: '#E4EBE3',
  accent: '#C97A4A', // warm terracotta, used sparingly (alerts, expiring items)
  accentMuted: '#F5E4D8',
  danger: '#C1493D',
  dangerMuted: '#F6E1DE',
  success: '#4E8A5E',
  white: '#FFFFFF',
  overlay: 'rgba(43, 42, 39, 0.4)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 17, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  bodyMuted: { fontSize: 15, fontWeight: '400' as const, color: colors.textMuted },
  caption: { fontSize: 13, fontWeight: '500' as const, color: colors.textMuted },
  label: { fontSize: 13, fontWeight: '600' as const, color: colors.textMuted },
};

export const shadow = {
  card: {
    shadowColor: '#2B2A27',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};

export const categoryIcons = [
  'snow-outline',
  'nutrition-outline',
  'file-tray-stacked-outline',
  'home-outline',
  'wine-outline',
  'basket-outline',
  'shirt-outline',
  'flower-outline',
  'construct-outline',
  'medkit-outline',
] as const;
