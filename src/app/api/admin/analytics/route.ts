import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, unauthorized } from "@/lib/admin-api";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();

  const [
    totalUsers,
    totalSignUps,
    totalSignIns,
    recentSignIns,
    recentSignUps,
    totalProducts,
    totalCategories,
    totalBanners,
    totalCoupons,
    authEvents,
  ] = await Promise.all([
    db.appUser.count(),
    db.authEvent.count({ where: { type: "signup" } }),
    db.authEvent.count({ where: { type: "signin" } }),
    db.authEvent.count({ where: { type: "signin", createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
    db.authEvent.count({ where: { type: "signup", createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
    db.product.count(),
    db.category.count(),
    db.banner.count(),
    db.coupon.count(),
    db.authEvent.findMany({ take: 20, orderBy: { createdAt: "desc" } }),
  ]);

  // fetch user names for recent events separately
  const userEmails = [...new Set(authEvents.map((e) => e.email))];
  const users = await db.appUser.findMany({ where: { email: { in: userEmails } }, select: { email: true, name: true } });
  const userMap = new Map(users.map((u) => [u.email, u.name]));

  // last 7 days signups/signins for chart
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const events = await db.authEvent.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { type: true, createdAt: true },
  });
  const days: { date: string; signups: number; signins: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, signups: 0, signins: 0 });
  }
  for (const ev of events) {
    const key = ev.createdAt.toISOString().slice(0, 10);
    const day = days.find((d) => d.date === key);
    if (day) {
      if (ev.type === "signup") day.signups++;
      else day.signins++;
    }
  }

  return NextResponse.json({
    totals: {
      users: totalUsers,
      signUps: totalSignUps,
      signIns: totalSignIns,
      products: totalProducts,
      categories: totalCategories,
      banners: totalBanners,
      coupons: totalCoupons,
    },
    last24h: {
      signIns: recentSignIns,
      signUps: recentSignUps,
    },
    chart: days,
    recentEvents: authEvents.map((e) => ({
      id: e.id,
      type: e.type,
      email: e.email,
      name: userMap.get(e.email) ?? null,
      createdAt: e.createdAt.toISOString(),
    })),
  });
}
