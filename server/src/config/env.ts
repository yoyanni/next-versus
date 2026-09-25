// External Imports
import "dotenv/config";

/**
 * Environment
 * -----------
 * Loads `.env` (local dev only; in production Docker Compose injects the vars)
 * and validates everything the server needs before any other module reads it.
 */
const { PORT = "5000", MONGODB_URI, CORS_ORIGIN, NODE_ENV } = process.env;

const isProd = NODE_ENV === "production";

function fail(message: string): never {
  console.error(`❌ ${message}`);
  process.exit(1);
}

if (!MONGODB_URI) fail("MONGODB_URI is not set.");
if (isProd && !CORS_ORIGIN) fail("CORS_ORIGIN must be set in production.");

export const env = {
  PORT: Number(PORT),
  MONGODB_URI,
  CORS_ORIGIN,
  isProd,
};
