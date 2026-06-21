import { Category } from '@/types';

export const categories: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: 'cellphone', color: '#10b981' },
  { id: 'fashion', name: 'Fashion', icon: 'tshirt-crew', color: '#f59e0b' },
  { id: 'home', name: 'Home & Living', icon: 'sofa', color: '#8b5cf6' },
  { id: 'beauty', name: 'Beauty', icon: 'lipstick', color: '#ec4899' },
  { id: 'sports', name: 'Sports', icon: 'dumbbell', color: '#ef4444' },
  { id: 'books', name: 'Books', icon: 'book-open-variant', color: '#0ea5e9' },
  { id: 'toys', name: 'Toys', icon: 'teddy-bear', color: '#f97316' },
  { id: 'grocery', name: 'Grocery', icon: 'cart-variant', color: '#84cc16' },
];

export const categoryMap: Record<string, Category> = categories.reduce(
  (acc, c) => ((acc[c.id] = c), acc),
  {} as Record<string, Category>
);
