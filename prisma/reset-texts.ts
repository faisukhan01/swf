import { db } from "../src/lib/db";
import { defaultTexts } from "../src/lib/app-texts";

async function main() {
  console.log("Resetting texts to defaults...");
  await db.appConfig.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", texts: JSON.stringify(defaultTexts) },
    update: { texts: JSON.stringify(defaultTexts) },
  });
  const config = await db.appConfig.findUnique({ where: { id: "singleton" } });
  const texts = JSON.parse(config?.texts || "{}");
  const empty = Object.values(texts).filter((v) => !v).length;
  console.log(`Done. ${Object.keys(texts).length} text fields, ${empty} empty.`);
}

main().catch(console.error).finally(() => db.$disconnect());
