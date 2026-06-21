import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await db.appUser.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ error: "No account found with this email. Please sign up first." }, { status: 404 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    await db.appUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date(), signInCount: { increment: 1 } },
    });

    await db.authEvent.create({
      data: { type: "signin", email: normalizedEmail, userId: user.id },
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email, joinedAt: user.createdAt.toISOString() },
    });
  } catch (e) {
    return NextResponse.json({ error: "Sign in failed" }, { status: 500 });
  }
}
