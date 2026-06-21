import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "swf-admin-secret-change-in-production-9k2m"
);

const SESSION_COOKIE = "swf_admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

export type AdminSession = {
  email: string;
  name: string | null;
  role: "admin";
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: AdminSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.email && payload.role === "admin") {
      return { email: payload.email as string, name: (payload.name as string) ?? null, role: "admin" };
    }
    return null;
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getSessionDuration() {
  return SESSION_DURATION;
}
