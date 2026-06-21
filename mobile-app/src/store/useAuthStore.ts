import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Address } from '@/types';

interface AuthState {
  user: User | null;
  addresses: Address[];
  hydrated: boolean;
  login: (email: string, name?: string) => Promise<void>;
  signup: (name: string, email: string) => Promise<void>;
  logout: () => void;
  addAddress: (a: Omit<Address, 'id'>) => Address;
  updateAddress: (id: string, patch: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  hydrate: () => Promise<void>;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      addresses: [],
      hydrated: false,
      login: async (email, name) => {
        await delay(450);
        const user: User = {
          id: 'u-' + Date.now(),
          name: name ?? email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
        };
        set({ user });
      },
      signup: async (name, email) => {
        await delay(500);
        const user: User = { id: 'u-' + Date.now(), name, email };
        set({ user });
      },
      logout: () => set({ user: null }),
      addAddress: (a) => {
        const id = 'addr-' + Date.now();
        const isFirst = get().addresses.length === 0;
        const newAddr: Address = { ...a, id, isDefault: a.isDefault ?? isFirst };
        set((s) => {
          let list = [...s.addresses];
          if (newAddr.isDefault) {
            list = list.map((x) => ({ ...x, isDefault: false }));
          }
          list.push(newAddr);
          return { addresses: list };
        });
        return newAddr;
      },
      updateAddress: (id, patch) =>
        set((s) => {
          let list = s.addresses.map((x) =>
            x.id === id ? { ...x, ...patch } : x
          );
          // if patch.isDefault === true, unset others
          if (patch.isDefault) {
            list = list.map((x) =>
              x.id === id ? { ...x, isDefault: true } : { ...x, isDefault: false }
            );
          }
          return { addresses: list };
        }),
      removeAddress: (id) =>
        set((s) => ({ addresses: s.addresses.filter((x) => x.id !== id) })),
      setDefaultAddress: (id) =>
        set((s) => ({
          addresses: s.addresses.map((x) => ({ ...x, isDefault: x.id === id })),
        })),
      hydrate: async () => {
        // The persist middleware rehydrates automatically; we just wait a tick
        // and flip a flag so the UI knows we are ready.
        await delay(50);
        set({ hydrated: true });
      },
    }),
    {
      name: 'faisu.auth',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
      partialize: (s) => ({ user: s.user, addresses: s.addresses }),
    }
  )
);
