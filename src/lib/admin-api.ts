import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "swf-admin-secret-change-in-production-9k2m"
);
const SESSION_COOKIE = "swf_admin_session";

export function getAdminToken(req: Request): string | null {
  const cookies = req.headers.get("cookie") || "";
  const match = cookies.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

export async function requireAdmin(req: Request): Promise<boolean> {
  const token = getAdminToken(req);
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
