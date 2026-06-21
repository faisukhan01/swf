import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '@/types';
import { productMap } from '@/data/products';

interface CartState {
  items: CartItem[];
  couponCode?: string;
  add: (item: CartItem) => void;
  remove: (productId: string, color?: string, size?: string) => void;
  setQty: (productId: string, qty: number, color?: string, size?: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  count: () => number;
  subtotal: () => number;
}

const sameLine = (a: CartItem, b: CartItem) =>
  a.productId === b.productId &&
  (a.color ?? '') === (b.color ?? '') &&
  (a.size ?? '') === (b.size ?? '');

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: undefined,
      add: (item) =>
        set((s) => {
          const idx = s.items.findIndex((i) => sameLine(i, item));
          if (idx >= 0) {
            const items = [...s.items];
            items[idx] = { ...items[idx], qty: items[idx].qty + item.qty };
            return { items };
          }
          return { items: [...s.items, item] };
        }),
      remove: (productId, color, size) =>
        set((s) => ({
          items: s.items.filter(
            (i) =>
              !(
                i.productId === productId &&
                (i.color ?? '') === (color ?? '') &&
                (i.size ?? '') === (size ?? '')
              )
          ),
        })),
      setQty: (productId, qty, color, size) =>
        set((s) => {
          if (qty <= 0) {
            return {
              items: s.items.filter(
                (i) =>
                  !(
                    i.productId === productId &&
                    (i.color ?? '') === (color ?? '') &&
                    (i.size ?? '') === (size ?? '')
                  )
              ),
            };
          }
          return {
            items: s.items.map((i) =>
              i.productId === productId &&
              (i.color ?? '') === (color ?? '') &&
              (i.size ?? '') === (size ?? '')
                ? { ...i, qty }
                : i
            ),
          };
        }),
      clear: () => set({ items: [], couponCode: undefined }),
      applyCoupon: (code) => set({ couponCode: code.toUpperCase().trim() }),
      removeCoupon: () => set({ couponCode: undefined }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => {
          const p = productMap[i.productId];
          return sum + (p ? p.price * i.qty : 0);
        }, 0),
    }),
    {
      name: 'faisu.cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
