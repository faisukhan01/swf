// Shared mobile data for the Shop With Faisu!! phone preview.
// Mirrors the React Native app's src/data/* so the in-browser preview is authentic.

export type Category = {
  id: string;
  name: string;
  icon: string; // MaterialCommunityIcons name (used as label in preview)
  color: string;
};

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  badge?: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  color: string;
};

export type Coupon = {
  code: string;
  description: string;
  minSubtotal: number;
  type: "percent" | "flat" | "shipping";
  value: number;
};

export const categories: Category[] = [
  { id: "electronics", name: "Electronics", icon: "cellphone", color: "#10b981" },
  { id: "fashion", name: "Fashion", icon: "tshirt-crew", color: "#f59e0b" },
  { id: "home", name: "Home & Living", icon: "sofa", color: "#8b5cf6" },
  { id: "beauty", name: "Beauty", icon: "lipstick", color: "#ec4899" },
  { id: "sports", name: "Sports", icon: "dumbbell", color: "#ef4444" },
  { id: "books", name: "Books", icon: "book-open-variant", color: "#0ea5e9" },
  { id: "toys", name: "Toys", icon: "teddy-bear", color: "#f97316" },
  { id: "grocery", name: "Grocery", icon: "cart-variant", color: "#84cc16" },
];

export const categoryMap: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c])
);

export const banners: Banner[] = [
  {
    id: "b1",
    title: "Flash Deals Week",
    subtitle: "Up to 40% off top brands — today only!",
    cta: "Shop Deals",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
    color: "#10b981",
  },
  {
    id: "b2",
    title: "New Season Arrivals",
    subtitle: "Fresh styles for fashion lovers",
    cta: "Explore Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
    color: "#f59e0b",
  },
  {
    id: "b3",
    title: "Free Shipping Weekend",
    subtitle: "On all orders above $35",
    cta: "Start Shopping",
    image: "https://images.unsplash.com/photo-1555721288-52c1c0c5b7f9?w=800",
    color: "#8b5cf6",
  },
];

export const coupons: Coupon[] = [
  { code: "FAISU10", description: "10% off orders over $50", minSubtotal: 50, type: "percent", value: 10 },
  { code: "FAISU25", description: "25% off orders over $150", minSubtotal: 150, type: "percent", value: 25 },
  { code: "WELCOME15", description: "$15 off orders over $75", minSubtotal: 75, type: "flat", value: 15 },
  { code: "FREESHIP", description: "Free shipping over $35", minSubtotal: 35, type: "shipping", value: 5 },
];

const pic = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

export const products: Product[] = [
  // Electronics
  { id: "p-el-01", name: "AuraBeam Wireless Headphones", categoryId: "electronics", price: 129.99, oldPrice: 179.99, rating: 4.7, reviewCount: 1284, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600","https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"], description: "Immerse yourself in studio-grade sound with active noise cancellation, 40h battery life, and plush memory-foam earcups. Bluetooth 5.3 with multipoint pairing.", colors: ["#0f172a","#10b981","#e2e8f0"], inStock: true, badge: "-28%" },
  { id: "p-el-02", name: "Nova Smartwatch Series 5", categoryId: "electronics", price: 199.0, oldPrice: 249.0, rating: 4.6, reviewCount: 842, images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"], description: "Track fitness, heart rate, SpO2 and sleep with a vibrant AMOLED display. 7-day battery, GPS, and 5 ATM water resistance.", colors: ["#0f172a","#f59e0b","#ec4899"], inStock: true, badge: "Hot" },
  { id: "p-el-03", name: "PulsePods Pro Earbuds", categoryId: "electronics", price: 79.99, rating: 4.4, reviewCount: 2150, images: ["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600"], description: "Compact truly-wireless earbuds with deep bass, transparency mode, and 24h total playback with the charging case.", colors: ["#ffffff","#0f172a"], inStock: true, badge: "New" },
  { id: "p-el-04", name: "VisionPro 4K Action Cam", categoryId: "electronics", price: 299.99, oldPrice: 349.99, rating: 4.5, reviewCount: 487, images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600"], description: "Capture every adventure in stunning 4K/60fps with electronic stabilization, waterproof body, and dual displays.", inStock: true },

  // Fashion
  { id: "p-fa-01", name: "Classic Denim Jacket", categoryId: "fashion", price: 64.99, oldPrice: 89.99, rating: 4.5, reviewCount: 642, images: ["https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600","https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600"], description: "A timeless mid-wash denim jacket cut for everyday wear. 100% cotton with reinforced stitching and antique brass buttons.", colors: ["#1e3a8a","#0f172a","#94a3b8"], sizes: ["XS","S","M","L","XL"], inStock: true, badge: "Sale" },
  { id: "p-fa-02", name: "Everyday White Sneakers", categoryId: "fashion", price: 54.99, rating: 4.6, reviewCount: 1520, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600","https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600"], description: "Minimalist leather-look sneakers with cushioned insoles and breathable lining. Goes with everything from jeans to chinos.", colors: ["#ffffff","#0f172a","#f59e0b"], sizes: ["7","8","9","10","11","12"], inStock: true, badge: "Hot" },
  { id: "p-fa-03", name: "Aviator Sunglasses", categoryId: "fashion", price: 29.99, oldPrice: 39.99, rating: 4.3, reviewCount: 318, images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"], description: "Polarized lenses with 100% UV400 protection in a classic aviator metal frame. Comes with a hard case and microfiber pouch.", colors: ["#0f172a","#a16207","#94a3b8"], inStock: true },
  { id: "p-fa-04", name: "Cotton Crew T-Shirt (3-Pack)", categoryId: "fashion", price: 34.99, rating: 4.4, reviewCount: 928, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"], description: "Premium combed-cotton crew-neck tees in three wardrobe staples. Pre-shrunk for a true fit and tagless for all-day comfort.", colors: ["#ffffff","#0f172a","#10b981"], sizes: ["S","M","L","XL","XXL"], inStock: true },

  // Home
  { id: "p-ho-01", name: "Scandinavian Lounge Chair", categoryId: "home", price: 219.0, oldPrice: 279.0, rating: 4.7, reviewCount: 264, images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600","https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600"], description: "A statement lounge chair with solid oak legs and a high-resilience foam seat. Upholstered in soft boucle fabric.", colors: ["#e7e5e4","#1c1917","#10b981"], inStock: true, badge: "Sale" },
  { id: "p-ho-02", name: "Aroma Diffuser & Lamp", categoryId: "home", price: 39.99, rating: 4.5, reviewCount: 511, images: ["https://images.unsplash.com/photo-1602874801006-1d5b95044413?w=600"], description: "Ultrasonic essential-oil diffuser with 7-color ambient LED lighting and whisper-quiet operation. Auto shut-off when empty.", inStock: true, badge: "New" },
  { id: "p-ho-03", name: "Ceramic Dinnerware Set (12 pc)", categoryId: "home", price: 89.99, oldPrice: 119.99, rating: 4.6, reviewCount: 187, images: ["https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=600"], description: "Stoneware dinner set for four — plates, bowls, and mugs in a matte reactive glaze. Dishwasher and microwave safe.", inStock: true },

  // Beauty
  { id: "p-be-01", name: "Velvet Matte Lipstick Trio", categoryId: "beauty", price: 32.0, oldPrice: 45.0, rating: 4.4, reviewCount: 740, images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600"], description: "Three long-wearing matte lipsticks in nude, rose, and ruby. Enriched with shea butter and vitamin E for a non-drying finish.", colors: ["#9f1239","#7c2d12","#831843"], inStock: true, badge: "-29%" },
  { id: "p-be-02", name: "HydraGlow Vitamin C Serum", categoryId: "beauty", price: 24.99, rating: 4.6, reviewCount: 1340, images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"], description: "Brightening 15% vitamin C + hyaluronic acid serum that visibly fades dark spots and boosts radiance in 4 weeks.", inStock: true, badge: "Hot" },
  { id: "p-be-03", name: "Everyday Mineral Sunscreen SPF 50", categoryId: "beauty", price: 18.99, oldPrice: 22.99, rating: 4.5, reviewCount: 826, images: ["https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600"], description: "Lightweight, reef-safe mineral sunscreen with zinc oxide. No white cast, non-greasy, and works great under makeup.", inStock: true },

  // Sports
  { id: "p-sp-01", name: "Adjustable Dumbbell Set (40 lb)", categoryId: "sports", price: 149.0, oldPrice: 199.0, rating: 4.7, reviewCount: 432, images: ["https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600","https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600"], description: "Space-saving adjustable dumbbells from 5 to 40 lb per hand. Quick-select dial and a durable steel construction.", inStock: true, badge: "Sale" },
  { id: "p-sp-02", name: "Pro Grip Yoga Mat", categoryId: "sports", price: 39.99, rating: 4.6, reviewCount: 1102, images: ["https://images.unsplash.com/photo-1591291621164-2c6367723315?w=600"], description: "Eco-friendly 6mm TPE yoga mat with double-sided non-slip texture and alignment lines. Comes with carry strap.", colors: ["#10b981","#6366f1","#f59e0b"], inStock: true },
  { id: "p-sp-03", name: "Insulated Sports Water Bottle 1L", categoryId: "sports", price: 22.99, oldPrice: 29.99, rating: 4.7, reviewCount: 2230, images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600"], description: "Double-walled vacuum insulated stainless steel bottle keeps drinks cold for 24h or hot for 12h. Leakproof, BPA-free.", colors: ["#10b981","#0f172a","#ef4444","#f59e0b"], inStock: true, badge: "Hot" },

  // Books
  { id: "p-bo-01", name: "Atomic Habits — Hardcover", categoryId: "books", price: 18.99, oldPrice: 24.0, rating: 4.9, reviewCount: 8420, images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600"], description: "An easy and proven way to build good habits and break bad ones. International bestseller with practical frameworks.", inStock: true, badge: "Hot" },
  { id: "p-bo-02", name: "The Pragmatic Programmer (20th Anniv.)", categoryId: "books", price: 34.99, rating: 4.8, reviewCount: 2410, images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600"], description: "A timeless guide to craftsmanship in software development. Updated classic with new chapters and modern examples.", inStock: true },
  { id: "p-bo-03", name: "Sapiens: A Brief History of Humankind", categoryId: "books", price: 16.99, rating: 4.7, reviewCount: 6110, images: ["https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600"], description: "A sweeping narrative of how Homo sapiens came to dominate the earth. Engaging, provocative, and unforgettable.", inStock: true },

  // Toys
  { id: "p-to-01", name: "Wooden Building Blocks (100 pc)", categoryId: "toys", price: 29.99, rating: 4.8, reviewCount: 412, images: ["https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600"], description: "Natural beech-wood building blocks in 12 shapes. Develops spatial reasoning and fine motor skills. Non-toxic finishes.", inStock: true, badge: "New" },
  { id: "p-to-02", name: "Remote Control Race Car", categoryId: "toys", price: 49.99, oldPrice: 69.99, rating: 4.5, reviewCount: 728, images: ["https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600"], description: "1:18 scale 2.4 GHz RC car with up to 25 km/h top speed, 4WD drive, and 60-min runtime. Includes rechargeable battery.", colors: ["#ef4444","#0f172a","#10b981"], inStock: true, badge: "-29%" },
  { id: "p-to-03", name: "Plush Teddy Bear (Large)", categoryId: "toys", price: 27.99, rating: 4.7, reviewCount: 296, images: ["https://images.unsplash.com/photo-1559454403-b8fb88521f37?w=600"], description: "Super-soft 60cm teddy bear with hypoallergenic fill and embroidered eyes. Surface-washable and certified child-safe.", inStock: true },

  // Grocery
  { id: "p-gr-01", name: "Single-Origin Coffee Beans 1kg", categoryId: "grocery", price: 21.99, oldPrice: 26.99, rating: 4.7, reviewCount: 1540, images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600"], description: "Ethically sourced medium-roast Arabica beans from Colombia. Notes of caramel, cocoa, and citrus. Roasted to order.", inStock: true, badge: "Sale" },
  { id: "p-gr-02", name: "Organic Manuka Honey 500g", categoryId: "grocery", price: 34.0, rating: 4.6, reviewCount: 488, images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600"], description: "Pure New Zealand Manuka honey, UMF 10+ certified. Raw, unpasteurized, and traceable to the hive.", inStock: true },
  { id: "p-gr-03", name: "Artisan Dark Chocolate Box", categoryId: "grocery", price: 19.99, oldPrice: 24.99, rating: 4.8, reviewCount: 622, images: ["https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600"], description: "A curated box of 12 single-origin dark chocolates (70-85% cacao) from award-winning chocolatiers.", inStock: true, badge: "Hot" },
];

export const productMap: Record<string, Product> = Object.fromEntries(
  products.map((p) => [p.id, p])
);

export const sampleReviews = [
  { id: "r1", author: "Ayesha K.", rating: 5, date: "2 weeks ago", text: "Exceeded my expectations. Quality is fantastic and delivery was quick!" },
  { id: "r2", author: "Bilal R.", rating: 4, date: "1 month ago", text: "Really good value for money. Minor packaging issue but product is great." },
  { id: "r3", author: "Sana M.", rating: 5, date: "1 month ago", text: "Exactly as described. Will definitely buy again from Shop With Faisu!" },
];

export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}
