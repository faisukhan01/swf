import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors } from './colors';
import { spacing, radius, layout } from './spacing';
import { typography } from './typography';
import { useThemeStore } from '@/store/useThemeStore';

export interface Theme {
  colors: ThemeColors;
  isDark: boolean;
  spacing: typeof spacing;
  radius: typeof radius;
  layout: typeof layout;
  typography: typeof typography;
}

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedIsDark = useThemeStore((s) => s.isDark);
  const systemScheme = useColorScheme();
  // Prefer the user's explicit choice; fall back to system scheme at first launch
  const isDark = storedIsDark ?? systemScheme === 'dark';

  const theme = useMemo<Theme>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      spacing,
      radius,
      layout,
      typography,
    }),
    [isDark]
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Theme => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export { lightColors, darkColors } from './colors';
export { spacing, radius, layout } from './spacing';
export { typography } from './typography';
