// External Imports
import express from "express";
import cors from "cors";

// Local Imports
import { env } from "./config/env";
import fighterRouter from "./routes/fighter.routes";

// Initialise app details
const app = express();

// Caddy is the only hop in front of the app; without this every visitor has Caddy's IP
app.set("trust proxy", 1);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Middleware
// Only the frontend origin in production; any origin in dev when CORS_ORIGIN is unset
app.use(cors(env.CORS_ORIGIN ? { origin: env.CORS_ORIGIN } : undefined));
// The largest seed fighter is under 5 KB
app.use(express.json({ limit: "16kb" }));
app.use("/api", fighterRouter);

export default app;
