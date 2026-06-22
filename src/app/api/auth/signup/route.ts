import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // For now, we're not using a database - users will be stored in localStorage on the client
    // Create a demo user response for signup
    const hashedPassword = await hashPassword(password);
    const user = {
      id: Date.now().toString(),
      name,
      email: normalizedEmail,
      password: hashedPassword, // Return hashed password so client can store it
      joinedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      ok: true,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        password: user.password, // Client will store this securely
        joinedAt: user.joinedAt 
      },
    });
  } catch (e) {
    console.error("[signup] ERROR:", e);
    return NextResponse.json({ error: "Sign up failed. Please try again." }, { status: 500 });
  }
}
