// Local Imports
import { env } from "./config/env";
import app from "./app";
import { connectDB } from "./config/db";
import { seedFighters } from "./seed";

try {
  await connectDB();
  await seedFighters();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}...`);
  });
} catch (err) {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
}
