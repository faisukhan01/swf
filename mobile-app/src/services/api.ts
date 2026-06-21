import { Product, Category, Coupon, Order, AppNotification } from '@/types';
import { products, productMap } from '@/data/products';
import { categories } from '@/data/categories';
import { reviewsForProduct } from '@/data/reviews';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getCategories(): Promise<Category[]> {
  await delay(250);
  return categories;
}

export async function getProducts(): Promise<Product[]> {
  await delay(400);
  return products;
}

export async function getProduct(id: string): Promise<Product | null> {
  await delay(350);
  return productMap[id] ?? null;
}

export async function getFeatured(): Promise<Product[]> {
  await delay(300);
  return products.filter((p) => p.badge === 'Hot' || p.badge === 'Sale').slice(0, 8);
}

export async function getFlashDeals(): Promise<Product[]> {
  await delay(350);
  return products.filter((p) => p.oldPrice).slice(0, 10);
}

export async function getNewArrivals(): Promise<Product[]> {
  await delay(300);
  return [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);
}

export async function getRecommended(): Promise<Product[]> {
  await delay(400);
  // pseudo-random but stable
  return [...products].sort((a, b) => a.id.localeCompare(b.id)).slice(0, 8);
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(300);
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.categoryId.toLowerCase().includes(q)
  );
}

export async function getReviews(productId: string) {
  await delay(250);
  return reviewsForProduct(productId);
}

export const coupons: Coupon[] = [
  { code: 'FAISU10', type: 'percent', value: 10, minSubtotal: 50, description: '10% off orders over $50' },
  { code: 'FAISU25', type: 'percent', value: 25, minSubtotal: 150, description: '25% off orders over $150' },
  { code: 'WELCOME15', type: 'flat', value: 15, minSubtotal: 75, description: '$15 off your first order over $75' },
  { code: 'FREESHIP', type: 'flat', value: 5, minSubtotal: 35, description: '$5 shipping credit on orders over $35' },
];

export function validateCoupon(code: string, subtotal: number): { ok: boolean; coupon?: Coupon; reason?: string } {
  const c = coupons.find((x) => x.code === code.toUpperCase().trim());
  if (!c) return { ok: false, reason: 'Invalid coupon code' };
  if (c.minSubtotal && subtotal < c.minSubtotal)
    return { ok: false, reason: `Requires a subtotal of $${c.minSubtotal}` };
  return { ok: true, coupon: c };
}

export function calcDiscount(coupon: Coupon | undefined, subtotal: number): number {
  if (!coupon) return 0;
  if (coupon.type === 'percent') return Math.round(subtotal * (coupon.value / 100) * 100) / 100;
  return Math.min(coupon.value, subtotal);
}

export async function placeOrder(order: Omit<Order, 'id' | 'createdAt' | 'status' | 'etaMs' | 'timeline'>): Promise<Order> {
  await delay(700);
  const now = Date.now();
  const eta = now + 1000 * 60 * 60 * 24 * 5; // 5 days
  const full: Order = {
    ...order,
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    createdAt: now,
    status: 'Processing',
    etaMs: eta,
    timeline: [
      { label: 'Order placed', at: now, done: true },
      { label: 'Processing', at: now + 1000 * 60 * 30, done: false },
      { label: 'Shipped', at: now + 1000 * 60 * 60 * 24, done: false },
      { label: 'Out for delivery', at: now + 1000 * 60 * 60 * 24 * 4, done: false },
      { label: 'Delivered', at: eta, done: false },
    ],
  };
  return full;
}

// In-memory order history for this session (no persistence in this mock layer;
// the UI could persist this in AsyncStorage separately if desired)
let _orders: Order[] = [];

export async function saveOrder(o: Order): Promise<void> {
  await delay(150);
  _orders = [o, ..._orders];
}

export async function getOrders(): Promise<Order[]> {
  await delay(350);
  return [..._orders];
}

export async function getOrder(id: string): Promise<Order | undefined> {
  await delay(200);
  return _orders.find((o) => o.id === id);
}

export async function getNotifications(): Promise<AppNotification[]> {
  await delay(300);
  const now = Date.now();
  return [
    {
      id: 'n1',
      type: 'promo',
      title: 'Flash Deals Week is live!',
      body: 'Up to 40% off the brands you love. Tap to shop deals.',
      createdAt: now - 1000 * 60 * 60 * 2,
      read: false,
    },
    {
      id: 'n2',
      type: 'promo',
      title: 'Free shipping weekend',
      body: 'Enjoy free delivery on all orders above $35, this weekend only.',
      createdAt: now - 1000 * 60 * 60 * 24,
      read: false,
    },
    {
      id: 'n3',
      type: 'system',
      title: 'Welcome to Shop With Faisu!',
      body: 'Your account is ready. Start exploring the catalog today.',
      createdAt: now - 1000 * 60 * 60 * 24 * 3,
      read: true,
    },
  ];
}
