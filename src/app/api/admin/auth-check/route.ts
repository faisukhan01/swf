import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "swf-admin-secret-change-in-production-9k2m"
);
const SESSION_COOKIE = "swf_admin_session";

export const runtime = "nodejs";

export async function GET() {
  const token = NextResponse.next().cookies;
  // Read from request via headers in edge-compatible way
  return NextResponse.json({ ok: true });
}

// Helper to verify auth from a request (used by other admin APIs)
export async function verifyAdmin(req: Request): Promise<boolean> {
  const cookies = req.headers.get("cookie") || "";
  const match = cookies.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) return false;
  try {
    await jwtVerify(match[1], JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export { db };
