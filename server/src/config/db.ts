// External Imports
import mongoose from "mongoose";

// Local Imports
import { env } from "./env";

const RETRY_DELAY = 3000; // 3 seconds

let isInitialConnection = true;
let shuttingDown = false;

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("✅ MongoDB connected");
    isInitialConnection = false;
  } catch (err) {
    console.error("❌ MongoDB initial connection error:", err);
    if (isInitialConnection) process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB runtime error:", err);
  mongoose.disconnect();
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
  // Don't reconnect when the disconnect is our own shutdown
  if (!shuttingDown) setTimeout(() => connectDB(), RETRY_DELAY);
});

// Close without triggering the reconnect in the "disconnected" listener
export const disconnectDB = async () => {
  shuttingDown = true;
  await mongoose.connection.close();
};

/**
 * Graceful shutdown
 * -----------------
 * SIGINT is Ctrl+C locally, SIGTERM is what `docker stop` / `docker compose up -d` send.
 * Without a SIGTERM handler Docker waits 10s and then SIGKILLs the container.
 */
const shutdown = async (signal: NodeJS.Signals) => {
  if (shuttingDown) return;

  try {
    await disconnectDB();
    console.log(`📴 MongoDB disconnected on ${signal}`);
  } catch (err) {
    console.error("❌ Error closing MongoDB connection:", err);
  }
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
