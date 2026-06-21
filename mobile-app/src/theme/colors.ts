// Brand color palette for Shop With Faisu!!

export const palette = {
  emerald: '#10b981',
  emeraldDark: '#059669',
  emeraldSoft: '#d1fae5',
  amber: '#f59e0b',
  amberDark: '#d97706',
  amberSoft: '#fef3c7',
  red: '#ef4444',
  rose: '#f43f5e',
  green: '#22c55e',
  blue: '#3b82f6', // used sparingly for info only
  slate: '#64748b',
} as const;

export const lightColors = {
  primary: palette.emerald,
  primaryDark: palette.emeraldDark,
  primarySoft: palette.emeraldSoft,
  accent: palette.amber,
  accentDark: palette.amberDark,
  accentSoft: palette.amberSoft,
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceAlt: '#f1f5f9',
  border: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  danger: palette.red,
  success: palette.green,
  star: palette.amber,
  shadow: 'rgba(15, 23, 42, 0.08)',
  overlay: 'rgba(15, 23, 42, 0.4)',
  ripple: 'rgba(15, 23, 42, 0.06)',
} as const;

export const darkColors = {
  primary: palette.emerald,
  primaryDark: palette.emeraldDark,
  primarySoft: '#064e3b',
  accent: palette.amber,
  accentDark: palette.amberDark,
  accentSoft: '#78350f',
  background: '#0b1120',
  surface: '#111827',
  surfaceAlt: '#1e293b',
  border: '#334155',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textSubtle: '#64748b',
  danger: palette.red,
  success: palette.green,
  star: palette.amber,
  shadow: 'rgba(0, 0, 0, 0.4)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  ripple: 'rgba(255, 255, 255, 0.08)',
} as const;

export type ThemeColors = {
  primary: string;
  primaryDark: string;
  primarySoft: string;
  accent: string;
  accentDark: string;
  accentSoft: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  danger: string;
  success: string;
  star: string;
  shadow: string;
  overlay: string;
  ripple: string;
};
