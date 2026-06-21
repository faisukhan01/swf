import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-api";

export const runtime = "nodejs";

export async function GET() {
  const config = await db.appConfig.findUnique({ where: { id: "singleton" } });
  if (!config) {
    return NextResponse.json({
      appName: "Shop With Faisu!!",
      tagline: "Shop smart, live better",
      logoUrl: null,
      primaryColor: "#10b981",
      primaryDarkColor: "#059669",
      accentColor: "#f59e0b",
      darkModeDefault: false,
      currency: "USD",
    });
  }
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const body = await req.json();
    const allowed = [
      "appName", "tagline", "logoUrl", "primaryColor", "primaryDarkColor",
      "accentColor", "darkModeDefault", "currency", "texts",
    ];
    const data: Record<string, unknown> = {};
    for (const k of allowed) {
      if (k in body) {
        if (k === "texts" && typeof body[k] === "object") {
          data[k] = JSON.stringify(body[k]);
        } else {
          data[k] = body[k];
        }
      }
    }
    const updated = await db.appConfig.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...data } as never,
      update: data as never,
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
  }
}
