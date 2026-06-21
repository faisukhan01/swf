import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDark: boolean | null; // null = follow system
  setDark: (v: boolean) => void;
  toggle: () => void;
  setSystem: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: null,
      setDark: (v) => set({ isDark: v }),
      toggle: () => {
        const current = get().isDark;
        // Treat null as "false" (system/light) for toggling purposes
        set({ isDark: current === null ? true : !current });
      },
      setSystem: () => set({ isDark: null }),
    }),
    {
      name: 'faisu.theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
