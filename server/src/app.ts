// External Imports
import express from "express";
import cors from "cors";

// Local Imports
import { env } from "./config/env";
import fighterRouter from "./routes/fighter.routes";

// Initialise app details
const app = express();

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Middleware
// Only the frontend origin in production; any origin in dev when CORS_ORIGIN is unset
app.use(cors(env.CORS_ORIGIN ? { origin: env.CORS_ORIGIN } : undefined));
app.use(express.json());
app.use("/api", fighterRouter);

export default app;
