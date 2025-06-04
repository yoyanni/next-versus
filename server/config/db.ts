import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1/localDB";
const RETRY_DELAY = 3000; // 3 seconds

let isInitialConnection = true;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
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
  setTimeout(() => connectDB(), RETRY_DELAY);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("📴 MongoDB disconnected on app termination");
  process.exit(0);
});
