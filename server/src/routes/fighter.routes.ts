import { Router } from "express";
import {
  getFighters,
  getFighterById,
  createFighter,
  editFighter,
  deleteFighter,
} from "../controllers/fighter.controller";
import { protectSeed } from "../middleware/protectSeed";
import { writeLimiter } from "../middleware/writeLimiter";

const fighterRouter = Router();

// Create
fighterRouter.post("/fighters", writeLimiter, createFighter);

// Read
fighterRouter.get("/fighters", getFighters);
fighterRouter.get("/fighters/:id", getFighterById);

// Update
fighterRouter.put("/fighters/:id", writeLimiter, protectSeed, editFighter);

// Delete
fighterRouter.delete("/fighters/:id", writeLimiter, protectSeed, deleteFighter);

export default fighterRouter;
