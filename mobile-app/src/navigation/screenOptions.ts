import { Theme } from '@/theme';

/**
 * Shared stack screen options used by every stack screen.
 * Header is hidden — we render our own AppBar for full control.
 */
export const stackScreenOptions = (theme: Theme) => ({
  headerShown: false,
  contentStyle: { backgroundColor: theme.colors.background },
  cardStyle: { backgroundColor: theme.colors.background },
} as const);

export const modalScreenOptions = (theme: Theme) => ({
  headerShown: false,
  presentation: 'modal' as const,
  contentStyle: { backgroundColor: theme.colors.background },
});
