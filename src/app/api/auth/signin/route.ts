import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, storedUsers } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if this is the admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@swf.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (normalizedEmail === adminEmail && password === adminPassword) {
      return NextResponse.json({
        ok: true,
        user: {
          id: "admin",
          name: "Admin",
          email: adminEmail,
          joinedAt: new Date().toISOString(),
        },
      });
    }

    // Check against stored users (from localStorage)
    if (storedUsers && Array.isArray(storedUsers)) {
      const user = storedUsers.find((u: any) => u.email === normalizedEmail);
      
      if (!user) {
        return NextResponse.json({ error: "No account found with this email. Please sign up first." }, { status: 404 });
      }

      // Verify password
      const valid = await verifyPassword(password, user.password);
      if (!valid) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
      }

      return NextResponse.json({
        ok: true,
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          joinedAt: user.joinedAt 
        },
      });
    }

    return NextResponse.json({ error: "No account found with this email. Please sign up first." }, { status: 404 });
  } catch (e) {
    console.error("[signin] ERROR:", e);
    return NextResponse.json({ error: "Sign in failed. Please try again." }, { status: 500 });
  }
}
