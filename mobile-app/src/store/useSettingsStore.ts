import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryId, LanguageCode, CurrencyCode } from '@/types';

interface SettingsState {
  pushNotifications: boolean;
  emailNotifications: boolean;
  orderUpdates: boolean;
  defaultCategory: CategoryId | 'all';
  language: LanguageCode;
  currency: CurrencyCode;
  setPush: (v: boolean) => void;
  setEmail: (v: boolean) => void;
  setOrderUpdates: (v: boolean) => void;
  setDefaultCategory: (c: CategoryId | 'all') => void;
  setLanguage: (l: LanguageCode) => void;
  setCurrency: (c: CurrencyCode) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      pushNotifications: true,
      emailNotifications: true,
      orderUpdates: true,
      defaultCategory: 'all',
      language: 'en',
      currency: 'USD',
      setPush: (v) => set({ pushNotifications: v }),
      setEmail: (v) => set({ emailNotifications: v }),
      setOrderUpdates: (v) => set({ orderUpdates: v }),
      setDefaultCategory: (c) => set({ defaultCategory: c }),
      setLanguage: (l) => set({ language: l }),
      setCurrency: (c) => set({ currency: c }),
    }),
    {
      name: 'faisu.settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
