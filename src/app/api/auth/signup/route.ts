import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    console.log("[signup] request:", { name, email, hasPassword: !!password });

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await db.appUser.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    console.log("[signup] password hashed OK");
    const user = await db.appUser.create({
      data: { name, email: normalizedEmail, password: hashed },
    });
    console.log("[signup] user created:", user.id);

    await db.authEvent.create({
      data: { type: "signup", email: normalizedEmail, userId: user.id },
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email, joinedAt: user.createdAt.toISOString() },
    });
  } catch (e) {
    console.error("[signup] ERROR:", e);
    return NextResponse.json({ error: "Sign up failed", detail: String(e) }, { status: 500 });
  }
}
