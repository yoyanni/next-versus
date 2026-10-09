// External Imports
import { rateLimit } from "express-rate-limit";

// Local Imports
import { isAdmin } from "./protectSeed";

// In-memory store: a few KB, and the counts reset when the container restarts
export const writeLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: isAdmin,
  message: { message: "Too many changes. Try again later." },
});
