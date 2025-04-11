import { db } from "./server/db";
import { sql } from "drizzle-orm";
async function test() {
  try {
    await db.execute(sql`SELECT 1`);
    console.log("✅ Connexion DB fonctionnelle");
  } catch (error) {
    console.error("❌ Erreur de connexion :", error);
  }
}
test();
