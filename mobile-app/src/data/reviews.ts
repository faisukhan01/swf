import { Review } from '@/types';

const day = 86_400_000;
const now = Date.now();

const baseReviews: Review[] = [
  {
    id: 'r1',
    productId: 'p-el-01',
    author: 'James Carter',
    rating: 5,
    title: 'Best headphones I have owned',
    comment:
      'Sound quality is incredible and the noise cancellation is on another level. Battery easily lasts me a week of commuting.',
    createdAt: now - day * 5,
  },
  {
    id: 'r2',
    productId: 'p-el-01',
    author: 'Priya Sharma',
    rating: 4,
    title: 'Great but pricey',
    comment: 'Loved the audio quality. Wish the ear cushions were slightly larger for long flights.',
    createdAt: now - day * 12,
  },
  {
    id: 'r3',
    productId: 'p-el-01',
    author: 'Diego M.',
    rating: 5,
    title: 'Comfortable for hours',
    comment: 'Wore them on a 14-hour flight and forgot they were on. Highly recommend.',
    createdAt: now - day * 20,
  },
  {
    id: 'r4',
    productId: 'p-fa-01',
    author: 'Hannah Lee',
    rating: 4,
    title: 'Perfect spring layer',
    comment: 'Great fit and quality denim. Color matches the photos exactly.',
    createdAt: now - day * 7,
  },
  {
    id: 'r5',
    productId: 'p-fa-01',
    author: 'Marcus T.',
    rating: 5,
    title: 'My new go-to',
    comment: 'Soft, structured, and looks good with everything. Ordered a second one.',
    createdAt: now - day * 16,
  },
  {
    id: 'r6',
    productId: 'p-fa-02',
    author: 'Sofia G.',
    rating: 5,
    title: 'Looks premium, feels great',
    comment: 'Surprised at how comfortable these are for the price. Cushioning is fantastic.',
    createdAt: now - day * 4,
  },
  {
    id: 'r7',
    productId: 'p-be-02',
    author: 'Aaliyah R.',
    rating: 5,
    title: 'My skin glows now',
    comment: 'After 3 weeks of use my dark spots are visibly lighter. Will repurchase.',
    createdAt: now - day * 9,
  },
  {
    id: 'r8',
    productId: 'p-bo-01',
    author: 'Ethan W.',
    rating: 5,
    title: 'Life-changing read',
    comment: 'Practical and actionable. I keep returning to it as a reference.',
    createdAt: now - day * 30,
  },
  {
    id: 'r9',
    productId: 'p-sp-01',
    author: 'Liam P.',
    rating: 5,
    title: 'Replaced my whole rack',
    comment: 'Saves so much space and the dial mechanism is buttery smooth.',
    createdAt: now - day * 11,
  },
  {
    id: 'r10',
    productId: 'p-gr-01',
    author: 'Noor K.',
    rating: 5,
    title: 'Best coffee at home',
    comment: 'Fresh, fragrant, and the flavor is miles ahead of supermarket beans.',
    createdAt: now - day * 6,
  },
];

export const reviews: Review[] = baseReviews;

export function reviewsForProduct(productId: string): Review[] {
  return baseReviews.filter((r) => r.productId === productId);
}
