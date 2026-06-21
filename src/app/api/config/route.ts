import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mergeTexts } from "@/lib/app-texts";

export const runtime = "nodejs";

// Public endpoint: returns the full app config for the phone preview.
// No auth required — this is read-only public catalog data.
export async function GET() {
  const [config, categories, products, banners, coupons] = await Promise.all([
    db.appConfig.findUnique({ where: { id: "singleton" } }),
    db.category.findMany({ orderBy: { order: "asc" } }),
    db.product.findMany(),
    db.banner.findMany({ orderBy: { order: "asc" } }),
    db.coupon.findMany(),
  ]);

  let textsOverrides: Record<string, string> | null = null;
  try {
    textsOverrides = config?.texts ? JSON.parse(config.texts) : null;
  } catch {
    textsOverrides = null;
  }

  return NextResponse.json({
    brand: {
      appName: config?.appName ?? "Shop With Faisu!!",
      tagline: config?.tagline ?? "Shop smart, live better",
      logoUrl: config?.logoUrl ?? null,
    },
    theme: {
      primaryColor: config?.primaryColor ?? "#10b981",
      primaryDarkColor: config?.primaryDarkColor ?? "#059669",
      accentColor: config?.accentColor ?? "#f59e0b",
      darkModeDefault: config?.darkModeDefault ?? false,
    },
    currency: config?.currency ?? "USD",
    texts: mergeTexts(textsOverrides),
    categories: categories.map((c) => ({ id: c.id, name: c.name, icon: c.icon, color: c.color })),
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      categoryId: p.categoryId,
      price: p.price,
      oldPrice: p.oldPrice ?? undefined,
      rating: p.rating,
      reviewCount: p.reviewCount,
      images: JSON.parse(p.images) as string[],
      description: p.description,
      colors: p.colors ? (JSON.parse(p.colors) as string[]) : undefined,
      sizes: p.sizes ? (JSON.parse(p.sizes) as string[]) : undefined,
      inStock: p.inStock,
      badge: p.badge ?? undefined,
    })),
    banners: banners.map((b) => ({
      id: b.id, title: b.title, subtitle: b.subtitle, cta: b.cta, image: b.image, color: b.color,
    })),
    coupons: coupons.map((c) => ({
      code: c.code, description: c.description, minSubtotal: c.minSubtotal, type: c.type as "percent" | "flat" | "shipping", value: c.value,
    })),
  });
}
