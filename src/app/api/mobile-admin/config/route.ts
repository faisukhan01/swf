import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

// Mobile admin config update: accepts a Bearer token (JWT) from the mobile admin login.
// This lets the in-app mobile admin editors save changes securely.
export async function PUT(req: NextRequest) {
  try {
    // Extract Bearer token from Authorization header
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Update config
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

    await db.appConfig.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...data } as never,
      update: data as never,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
  }
}
