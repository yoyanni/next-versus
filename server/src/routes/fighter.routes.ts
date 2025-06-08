import { Router } from "express";
import { getFighters, getFighterById } from "../controllers/fighter.controller";

const fighterRouter = Router();

// Read
fighterRouter.get("/fighters", getFighters);
fighterRouter.get("/fighters/:id", getFighterById);

export default fighterRouter;
