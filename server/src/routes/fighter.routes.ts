import { Router } from "express";
import {
  getFighters,
  getFighterById,
  createFighter,
} from "../controllers/fighter.controller";

const fighterRouter = Router();

// Create
fighterRouter.post("/fighters", createFighter);

// Read
fighterRouter.get("/fighters", getFighters);
fighterRouter.get("/fighters/:id", getFighterById);

export default fighterRouter;
