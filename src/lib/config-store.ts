"use client";

import { create } from "zustand";
import {
  products as defaultProducts,
  categories as defaultCategories,
  banners as defaultBanners,
  coupons as defaultCoupons,
  type Product,
  type Category,
  type Banner,
  type Coupon,
} from "./mobile-data";
import { defaultTexts, type AppTexts } from "./app-texts";

export type AppBrand = {
  appName: string;
  tagline: string;
  logoUrl: string | null;
};

export type AppTheme = {
  primaryColor: string;
  primaryDarkColor: string;
  accentColor: string;
  darkModeDefault: boolean;
};

type ConfigState = {
  brand: AppBrand;
  theme: AppTheme;
  currency: string;
  texts: AppTexts;
  categories: Category[];
  products: Product[];
  banners: Banner[];
  coupons: Coupon[];
  loaded: boolean;
  load: () => Promise<void>;
};

const defaultBrand: AppBrand = {
  appName: "Shop With Faisu!!",
  tagline: "Shop smart, live better",
  logoUrl: null,
};

const defaultTheme: AppTheme = {
  primaryColor: "#10b981",
  primaryDarkColor: "#059669",
  accentColor: "#f59e0b",
  darkModeDefault: false,
};

export const useConfigStore = create<ConfigState>((set, get) => ({
  brand: defaultBrand,
  theme: defaultTheme,
  currency: "USD",
  texts: { ...defaultTexts },
  categories: defaultCategories,
  products: defaultProducts,
  banners: defaultBanners,
  coupons: defaultCoupons,
  loaded: false,

  load: async () => {
    try {
      const res = await fetch("/api/config", { cache: "no-store" });
      if (!res.ok) throw new Error("config fetch failed");
      const data = await res.json();
      set({
        brand: data.brand ?? defaultBrand,
        theme: data.theme ?? defaultTheme,
        currency: data.currency ?? "USD",
        texts: { ...defaultTexts, ...(data.texts ?? {}) },
        categories: data.categories ?? defaultCategories,
        products: data.products ?? defaultProducts,
        banners: data.banners ?? defaultBanners,
        coupons: data.coupons ?? defaultCoupons,
        loaded: true,
      });
    } catch {
      // keep defaults; mark loaded so UI doesn't hang
      set({ loaded: true });
    }
  },
}));

// Derived helpers (recompute on each call — cheap for these sizes)
export function useProductMap(): Record<string, Product> {
  const products = useConfigStore((s) => s.products);
  return Object.fromEntries(products.map((p) => [p.id, p]));
}

export function useCategoryMap(): Record<string, Category> {
  const categories = useConfigStore((s) => s.categories);
  return Object.fromEntries(categories.map((c) => [c.id, c]));
}
