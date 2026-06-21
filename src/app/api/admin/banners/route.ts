import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-api";

export const runtime = "nodejs";

export async function GET() {
  const banners = await db.banner.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const body = await req.json();
    const count = await db.banner.count();
    const created = await db.banner.create({
      data: {
        id: body.id || `b-${Date.now()}`,
        title: body.title || "",
        subtitle: body.subtitle || "",
        cta: body.cta || "Shop Now",
        image: body.image || "",
        color: body.color || "#10b981",
        order: body.order ?? count,
      },
    });
    return NextResponse.json(created);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    const updated = await db.banner.update({
      where: { id },
      data: {
        title: rest.title,
        subtitle: rest.subtitle,
        cta: rest.cta,
        image: rest.image,
        color: rest.color,
        order: rest.order,
      } as never,
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.banner.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
