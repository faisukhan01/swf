"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "./mobile-data";

export type CartLine = {
  productId: string;
  qty: number;
  color?: string;
  size?: string;
};

export type Tab = "home" | "shop" | "cart" | "wishlist" | "profile";

type State = {
  // navigation
  activeTab: Tab;
  stack: { screen: string; params?: Record<string, unknown> }[];
  // data
  cart: CartLine[];
  wishlist: string[];
  darkMode: boolean;
  couponCode: string | null;
  orders: { id: string; date: string; total: number; status: string; items: CartLine[] }[];

  // actions
  setTab: (t: Tab) => void;
  push: (screen: string, params?: Record<string, unknown>) => void;
  pop: () => void;
  resetTo: (screen: string, params?: Record<string, unknown>) => void;

  addToCart: (productId: string, qty?: number, color?: string, size?: string) => void;
  updateQty: (productId: string, qty: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;

  toggleWishlist: (productId: string) => void;
  isWished: (productId: string) => boolean;

  toggleDark: () => void;
  applyCoupon: (code: string | null) => void;
  placeOrder: (total: number) => string;
};

const lineKey = (productId: string, color?: string, size?: string) =>
  `${productId}__${color ?? ""}__${size ?? ""}`;

export const useMobileStore = create<State>()(
  persist(
    (set, get) => ({
      activeTab: "home",
      stack: [{ screen: "Home" }],
      cart: [],
      wishlist: [],
      darkMode: false,
      couponCode: null,
      orders: [],

      setTab: (t) =>
        set((s) => ({
          activeTab: t,
          stack:
            t === "home"
              ? [{ screen: "Home" }]
              : t === "shop"
              ? [{ screen: "Shop" }]
              : t === "cart"
              ? [{ screen: "Cart" }]
              : t === "wishlist"
              ? [{ screen: "Wishlist" }]
              : [{ screen: "Profile" }],
        })),

      push: (screen, params) =>
        set((s) => ({ stack: [...s.stack, { screen, params }] })),

      pop: () =>
        set((s) =>
          s.stack.length > 1 ? { stack: s.stack.slice(0, -1) } : s
        ),

      resetTo: (screen, params) => set({ stack: [{ screen, params }] }),

      addToCart: (productId, qty = 1, color, size) =>
        set((s) => {
          const idx = s.cart.findIndex(
            (l) => lineKey(l.productId, l.color, l.size) === lineKey(productId, color, size)
          );
          if (idx >= 0) {
            const cart = [...s.cart];
            cart[idx] = { ...cart[idx], qty: cart[idx].qty + qty };
            return { cart };
          }
          return { cart: [...s.cart, { productId, qty, color, size }] };
        }),

      updateQty: (productId, qty, color, size) =>
        set((s) => ({
          cart: s.cart
            .map((l) =>
              lineKey(l.productId, l.color, l.size) === lineKey(productId, color, size)
                ? { ...l, qty }
                : l
            )
            .filter((l) => l.qty > 0),
        })),

      removeFromCart: (productId, color, size) =>
        set((s) => ({
          cart: s.cart.filter(
            (l) => lineKey(l.productId, l.color, l.size) !== lineKey(productId, color, size)
          ),
        })),

      clearCart: () => set({ cart: [], couponCode: null }),

      toggleWishlist: (productId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(productId)
            ? s.wishlist.filter((id) => id !== productId)
            : [...s.wishlist, productId],
        })),

      isWished: (productId) => get().wishlist.includes(productId),

      toggleDark: () => set((s) => ({ darkMode: !s.darkMode })),

      applyCoupon: (code) => set({ couponCode: code }),

      placeOrder: (total) => {
        const id = "SWF" + Math.floor(100000 + Math.random() * 900000).toString();
        const order = {
          id,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          total,
          status: "Processing",
          items: get().cart,
        };
        set((s) => ({ orders: [order, ...s.orders], cart: [], couponCode: null }));
        return id;
      },
    }),
    {
      name: "swf-preview",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        cart: s.cart,
        wishlist: s.wishlist,
        darkMode: s.darkMode,
        orders: s.orders,
      }),
    }
  )
);
