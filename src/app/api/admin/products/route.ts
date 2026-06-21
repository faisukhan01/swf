import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-api";

export const runtime = "nodejs";

export async function GET() {
  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products.map(parseProduct));
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const body = await req.json();
    const created = await db.product.create({
      data: {
        id: body.id || `p-${Date.now()}`,
        name: body.name,
        categoryId: body.categoryId,
        price: Number(body.price),
        oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
        rating: Number(body.rating) || 4.5,
        reviewCount: Number(body.reviewCount) || 0,
        images: JSON.stringify(body.images || []),
        description: body.description || "",
        colors: body.colors ? JSON.stringify(body.colors) : null,
        sizes: body.sizes ? JSON.stringify(body.sizes) : null,
        inStock: body.inStock ?? true,
        badge: body.badge || null,
      },
    });
    return NextResponse.json(parseProduct(created));
  } catch (e) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    const data: Record<string, unknown> = {};
    if ("name" in rest) data.name = rest.name;
    if ("categoryId" in rest) data.categoryId = rest.categoryId;
    if ("price" in rest) data.price = Number(rest.price);
    if ("oldPrice" in rest) data.oldPrice = rest.oldPrice ? Number(rest.oldPrice) : null;
    if ("rating" in rest) data.rating = Number(rest.rating);
    if ("reviewCount" in rest) data.reviewCount = Number(rest.reviewCount);
    if ("images" in rest) data.images = JSON.stringify(rest.images);
    if ("description" in rest) data.description = rest.description;
    if ("colors" in rest) data.colors = rest.colors ? JSON.stringify(rest.colors) : null;
    if ("sizes" in rest) data.sizes = rest.sizes ? JSON.stringify(rest.sizes) : null;
    if ("inStock" in rest) data.inStock = rest.inStock;
    if ("badge" in rest) data.badge = rest.badge || null;
    const updated = await db.product.update({ where: { id }, data: data as never });
    return NextResponse.json(parseProduct(updated));
  } catch (e) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

function parseProduct(p: {
  id: string; name: string; categoryId: string; price: number; oldPrice: number | null;
  rating: number; reviewCount: number; images: string; description: string;
  colors: string | null; sizes: string | null; inStock: boolean; badge: string | null; createdAt: Date;
}) {
  return {
    id: p.id,
    name: p.name,
    categoryId: p.categoryId,
    price: p.price,
    oldPrice: p.oldPrice,
    rating: p.rating,
    reviewCount: p.reviewCount,
    images: JSON.parse(p.images),
    description: p.description,
    colors: p.colors ? JSON.parse(p.colors) : undefined,
    sizes: p.sizes ? JSON.parse(p.sizes) : undefined,
    inStock: p.inStock,
    badge: p.badge ?? undefined,
    createdAt: p.createdAt,
  };
}
