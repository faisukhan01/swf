import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export const runtime = "nodejs";

// Mobile admin login: verifies admin credentials and returns a JWT token
// that the mobile app can use for admin mutations (editing config, texts, etc.)
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await db.adminUser.findUnique({ where: { email: normalizedEmail } });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create a JWT token (same as web admin session)
    const token = await createSession({
      email: admin.email,
      name: admin.name,
      role: "admin",
    });

    return NextResponse.json({
      ok: true,
      token,
      admin: { name: admin.name, email: admin.email },
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
