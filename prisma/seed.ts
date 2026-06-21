import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";
import { products as defaultProducts, categories as defaultCategories, banners as defaultBanners, coupons as defaultCoupons } from "../src/lib/mobile-data";

async function main() {
  console.log("Seeding database...");

  // 1. Admin user
  const adminEmail = "faisu577277@gmail.com";
  const adminPassword = "QaReLc_61y8";
  const existing = await db.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await db.adminUser.create({
      data: { email: adminEmail, password: await hashPassword(adminPassword), name: "Faisu" },
    });
    console.log(`  ✓ Admin user created: ${adminEmail}`);
  } else {
    console.log(`  • Admin user already exists: ${adminEmail}`);
  }

  // 2. App config singleton
  await db.appConfig.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      appName: "Shop With Faisu!!",
      tagline: "Shop smart, live better",
      primaryColor: "#10b981",
      primaryDarkColor: "#059669",
      accentColor: "#f59e0b",
      darkModeDefault: false,
      currency: "USD",
    },
    update: {},
  });
  console.log("  ✓ App config seeded");

  // 3. Categories
  await db.category.deleteMany();
  for (let i = 0; i < defaultCategories.length; i++) {
    const c = defaultCategories[i];
    await db.category.create({ data: { id: c.id, name: c.name, icon: c.icon, color: c.color, order: i } });
  }
  console.log(`  ✓ ${defaultCategories.length} categories seeded`);

  // 4. Products
  await db.product.deleteMany();
  for (const p of defaultProducts) {
    // pad to 4 images
    const images = [...p.images];
    while (images.length < 4) images.push(`https://picsum.photos/seed/${p.id}-${images.length}/600/600`);
    await db.product.create({
      data: {
        id: p.id,
        name: p.name,
        categoryId: p.categoryId,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        rating: p.rating,
        reviewCount: p.reviewCount,
        images: JSON.stringify(images),
        description: p.description,
        colors: p.colors ? JSON.stringify(p.colors) : null,
        sizes: p.sizes ? JSON.stringify(p.sizes) : null,
        inStock: p.inStock,
        badge: p.badge ?? null,
      },
    });
  }
  console.log(`  ✓ ${defaultProducts.length} products seeded`);

  // 5. Banners
  await db.banner.deleteMany();
  for (let i = 0; i < defaultBanners.length; i++) {
    const b = defaultBanners[i];
    await db.banner.create({
      data: { id: b.id, title: b.title, subtitle: b.subtitle, cta: b.cta, image: b.image, color: b.color, order: i },
    });
  }
  console.log(`  ✓ ${defaultBanners.length} banners seeded`);

  // 6. Coupons
  await db.coupon.deleteMany();
  for (const c of defaultCoupons) {
    await db.coupon.create({
      data: { code: c.code, description: c.description, minSubtotal: c.minSubtotal, type: c.type, value: c.value },
    });
  }
  console.log(`  ✓ ${defaultCoupons.length} coupons seeded`);

  console.log("\n✅ Seed complete!");
  console.log(`   Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
