import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-api";

export const runtime = "nodejs";

export async function GET() {
  const coupons = await db.coupon.findMany();
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const body = await req.json();
    const created = await db.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        description: body.description || "",
        minSubtotal: Number(body.minSubtotal) || 0,
        type: body.type || "percent",
        value: Number(body.value) || 0,
      },
    });
    return NextResponse.json(created);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const body = await req.json();
    const { code, ...rest } = body;
    const updated = await db.coupon.update({
      where: { code },
      data: {
        description: rest.description,
        minSubtotal: Number(rest.minSubtotal),
        type: rest.type,
        value: Number(rest.value),
      } as never,
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
    await db.coupon.delete({ where: { code } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
