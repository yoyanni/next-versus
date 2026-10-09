// External Imports
import { createHash, timingSafeEqual } from "node:crypto";
import { NextFunction, Request, Response } from "express";

// Local Imports
import { SANDBOX_ID_START } from "@shared/limits";
import { env } from "../config/env";

const sha256 = (value: string) => createHash("sha256").update(value).digest();

// Digests are compared so the lengths always match and the token's length doesn't leak
export function isAdmin(req: Request): boolean {
  if (!env.ADMIN_TOKEN) return false;
  const [scheme, token] = (req.headers.authorization ?? "").split(" ");
  if (scheme !== "Bearer" || !token) return false;
  return timingSafeEqual(sha256(token), sha256(env.ADMIN_TOKEN));
}

// Seed fighters can only be changed with the admin token. A non-numeric id is refused as well.
export function protectSeed(req: Request, res: Response, next: NextFunction) {
  const isSandbox = Number(req.params.id) >= SANDBOX_ID_START;
  if (isSandbox || isAdmin(req)) return next();
  res.status(403).json({ message: "Seed fighters are read-only." });
}
