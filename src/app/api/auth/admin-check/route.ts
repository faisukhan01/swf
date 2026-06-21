import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

// Checks if the given credentials belong to an admin.
// Used by the mobile app to grant admin privileges on sign-in.
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ isAdmin: false });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await db.adminUser.findUnique({ where: { email: normalizedEmail } });

    if (!admin) {
      return NextResponse.json({ isAdmin: false });
    }

    const valid = await verifyPassword(password, admin.password);
    if (!valid) {
      return NextResponse.json({ isAdmin: false });
    }

    return NextResponse.json({
      isAdmin: true,
      name: admin.name,
      email: admin.email,
    });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
