import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-api";

export const runtime = "nodejs";

export async function GET() {
  const cats = await db.category.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(cats);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const body = await req.json();
    const count = await db.category.count();
    const created = await db.category.create({
      data: {
        id: body.id || `cat-${Date.now()}`,
        name: body.name || "New Category",
        icon: body.icon || "tag",
        color: body.color || "#10b981",
        order: body.order ?? count,
      },
    });
    return NextResponse.json(created);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    const updated = await db.category.update({
      where: { id },
      data: {
        name: rest.name,
        icon: rest.icon,
        color: rest.color,
        order: rest.order,
      } as never,
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
