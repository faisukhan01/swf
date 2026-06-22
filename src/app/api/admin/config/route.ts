import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
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
  } catch (e) {
    // Database not available - return defaults
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
}

export async function PUT(req: NextRequest) {
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
    
    try {
      // Try to save to database if available
      const updated = await db.appConfig.upsert({
        where: { id: "singleton" },
        create: { id: "singleton", ...data } as never,
        update: data as never,
      });
      return NextResponse.json({ ok: true, config: updated });
    } catch (dbError) {
      // Database not available - use localStorage on client
      // Return success so client can store in localStorage
      console.log("[admin/config] Database not available, client will use localStorage");
      return NextResponse.json({ 
        ok: true, 
        useLocalStorage: true,
        config: { id: "singleton", ...data } 
      });
    }
  } catch (e) {
    console.error("[admin/config] PUT error:", e);
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
  }
}
