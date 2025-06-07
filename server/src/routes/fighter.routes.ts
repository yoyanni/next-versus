import { Router } from "express";
import { getFighters } from "../controllers/fighter.controller";

const fighterRouter = Router();

fighterRouter.get("/fighters", getFighters);

export default fighterRouter;
