import { Router } from "express";
import {
  getFighters,
  getFighterById,
  createFighter,
  editFighter,
} from "../controllers/fighter.controller";

const fighterRouter = Router();

// Create
fighterRouter.post("/fighters", createFighter);

// Read
fighterRouter.get("/fighters", getFighters);
fighterRouter.get("/fighters/:id", getFighterById);

// Update
fighterRouter.put("/fighters/:id", editFighter);

export default fighterRouter;
