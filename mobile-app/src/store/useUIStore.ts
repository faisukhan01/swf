import { create } from 'zustand';
import { CategoryId, SortOption } from '@/types';

interface UIState {
  searchQuery: string;
  selectedCategory: CategoryId | 'all';
  sort: SortOption;
  priceMax: number;
  minRating: number;
  recentSearches: string[];
  setSearch: (q: string) => void;
  setCategory: (c: CategoryId | 'all') => void;
  setSort: (s: SortOption) => void;
  setPriceMax: (n: number) => void;
  setMinRating: (n: number) => void;
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;
  resetFilters: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  searchQuery: '',
  selectedCategory: 'all',
  sort: 'popular',
  priceMax: 500,
  minRating: 0,
  recentSearches: [],
  setSearch: (q) => set({ searchQuery: q }),
  setCategory: (c) => set({ selectedCategory: c }),
  setSort: (s) => set({ sort: s }),
  setPriceMax: (n) => set({ priceMax: n }),
  setMinRating: (n) => set({ minRating: n }),
  addRecentSearch: (q) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const list = [trimmed, ...get().recentSearches.filter((x) => x !== trimmed)].slice(0, 8);
    set({ recentSearches: list });
  },
  clearRecentSearches: () => set({ recentSearches: [] }),
  resetFilters: () =>
    set({ selectedCategory: 'all', sort: 'popular', priceMax: 500, minRating: 0, searchQuery: '' }),
}));
