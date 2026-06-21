// Core domain types for Shop With Faisu!!

export type CategoryId =
  | 'electronics'
  | 'fashion'
  | 'home'
  | 'beauty'
  | 'sports'
  | 'books'
  | 'toys'
  | 'grocery';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string; // MaterialCommunityIcons name
  color: string; // hex
}

export type Badge = 'New' | 'Sale' | 'Hot' | string;

export interface Product {
  id: string;
  name: string;
  categoryId: CategoryId;
  price: number;
  oldPrice?: number;
  rating: number; // 0-5
  reviewCount: number;
  images: string[];
  description: string;
  colors?: string[]; // hex
  sizes?: string[];
  inStock: boolean;
  badge?: Badge;
  createdAt: number; // epoch ms (used for "newest" sort)
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: number;
}

export interface CartItem {
  productId: string;
  qty: number;
  color?: string;
  size?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

export type PaymentMethod = 'COD' | 'Card' | 'Wallet';

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  address: Address;
  payment: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  createdAt: number;
  etaMs: number; // estimated delivery time from createdAt
  timeline: { label: string; at: number; done: boolean }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minSubtotal?: number;
  description: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  color: string;
}

export type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'newest';

export interface AppNotification {
  id: string;
  type: 'promo' | 'order' | 'system';
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
}
