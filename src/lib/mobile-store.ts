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

export type ReviewInput = {
  productId: string;
  rating: number;
  title: string;
  body: string;
  recommend: boolean | null;
  author: string;
  date: string;
};

export type Settings = {
  pushNotifications: boolean;
  emailNotifications: boolean;
  orderUpdates: boolean;
  defaultCategory: string;
  language: string;
  currency: string;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  isAdmin?: boolean;
};

type State = {
  // navigation
  activeTab: Tab;
  stack: { screen: string; params?: Record<string, unknown> }[];
  // data
  cart: CartLine[];
  wishlist: string[];
  recentlyViewed: string[];
  reviews: ReviewInput[];
  darkMode: boolean;
  couponCode: string | null;
  orders: { id: string; date: string; total: number; status: string; items: CartLine[]; tracking?: TrackingStep[] }[];
  settings: Settings;
  user: AppUser | null;
  adminToken: string | null;

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

  addRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;

  submitReview: (r: ReviewInput) => void;
  getReviews: (productId: string) => ReviewInput[];

  updateSettings: (patch: Partial<Settings>) => void;

  signIn: (user: AppUser) => void;
  signOut: () => void;
  setAdminToken: (token: string | null) => void;

  toggleDark: () => void;
  applyCoupon: (code: string | null) => void;
  placeOrder: (total: number) => string;
};

export type TrackingStep = {
  label: string;
  desc: string;
  time: string;
  done: boolean;
  current: boolean;
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
      recentlyViewed: [],
      reviews: [],
      darkMode: false,
      couponCode: null,
      orders: [],
      settings: {
        pushNotifications: true,
        emailNotifications: true,
        orderUpdates: true,
        defaultCategory: "all",
        language: "English",
        currency: "USD",
      },
      user: null,
      adminToken: null,

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

      addRecentlyViewed: (productId) =>
        set((s) => ({
          recentlyViewed: [
            productId,
            ...s.recentlyViewed.filter((id) => id !== productId),
          ].slice(0, 20),
        })),

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      submitReview: (r) => set((s) => ({ reviews: [r, ...s.reviews] })),

      getReviews: (productId) =>
        get().reviews.filter((r) => r.productId === productId),

      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      signIn: (user) => set({ user }),
      signOut: () => set({ user: null, adminToken: null }),
      setAdminToken: (token) => set({ adminToken: token }),

      applyCoupon: (code) => set({ couponCode: code }),

      placeOrder: (total) => {
        const id = "SWF" + Math.floor(100000 + Math.random() * 900000).toString();
        const now = new Date();
        const fmt = (d: Date) =>
          d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
        const tracking: TrackingStep[] = [
          { label: "Order Placed", desc: "We've received your order", time: fmt(now), done: true, current: false },
          { label: "Processing", desc: "Seller is preparing your items", time: "Pending", done: false, current: true },
          { label: "Shipped", desc: "On the way to courier facility", time: "Pending", done: false, current: false },
          { label: "Out for Delivery", desc: "Your order is out for delivery", time: "Pending", done: false, current: false },
          { label: "Delivered", desc: "Expected in 3-5 business days", time: "Pending", done: false, current: false },
        ];
        const order = {
          id,
          date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          total,
          status: "Processing",
          items: get().cart,
          tracking,
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
        recentlyViewed: s.recentlyViewed,
        reviews: s.reviews,
        darkMode: s.darkMode,
        orders: s.orders,
        settings: s.settings,
        user: s.user,
        adminToken: s.adminToken,
      }),
    }
  )
);
