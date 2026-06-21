import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RecentlyViewedState {
  ids: string[];
  /** Prepend a product id, dedupe, cap at 20. */
  add: (productId: string) => void;
  /** Remove a single product from recently viewed. */
  remove: (productId: string) => void;
  /** Clear the entire recently viewed history. */
  clear: () => void;
}

const MAX_RECENT = 20;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (productId) => {
        if (!productId) return;
        const next = [productId, ...get().ids.filter((x) => x !== productId)].slice(0, MAX_RECENT);
        set({ ids: next });
      },
      remove: (productId) =>
        set((s) => ({ ids: s.ids.filter((x) => x !== productId) })),
      clear: () => set({ ids: [] }),
    }),
    {
      name: 'faisu.recentlyViewed',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
