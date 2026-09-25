/**
 * Local reset: wipes the fighters collection and reseeds it from server/seed/fighters.json.
 * Usage: npm run seed --workspace=server
 */

// Local Imports
import { connectDB, disconnectDB } from "../config/db";
import { seedFighters } from "../seed";

try {
  await connectDB();
  await seedFighters({ reset: true });
} catch (err) {
  console.error("❌ Seeding failed:", err);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
