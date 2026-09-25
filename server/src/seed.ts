// External Imports
import { readFile } from "fs/promises";

// Internal Imports
import Fighter from "./models/fighter.model";
import { Fighter as IFighter } from "@shared/types";

/**
 * Seed file location
 * ------------------
 * Resolved relative to this module: both `src/seed.ts` (tsx) and `dist/server.js` (bundle)
 * sit one level below `server/`, so this points at `server/seed/fighters.json` in both.
 * It is read from disk rather than imported, so the ~3 MB file stays out of the bundle
 * and out of memory unless we actually seed.
 */
const SEED_FILE = new URL("../seed/fighters.json", import.meta.url);

// Insert in small batches: one insertMany of all 390 builds every Mongoose document at once
// and peaked at ~184 MiB in the 256 MiB container
const BATCH_SIZE = 50;

/**
 * Seeds the fighters collection.
 * By default it only runs when the collection is empty (fresh VPS / fresh local DB).
 * With `reset`, it wipes the collection first and always reseeds.
 */
export const seedFighters = async ({ reset = false } = {}) => {
  if (!reset && (await Fighter.estimatedDocumentCount()) > 0) return;

  const fighters: IFighter[] = JSON.parse(await readFile(SEED_FILE, "utf-8"));

  if (reset) await Fighter.deleteMany({});
  for (let i = 0; i < fighters.length; i += BATCH_SIZE) {
    await Fighter.insertMany(fighters.slice(i, i + BATCH_SIZE));
  }

  console.log(`🌱 Seeded ${fighters.length} fighters`);
};
