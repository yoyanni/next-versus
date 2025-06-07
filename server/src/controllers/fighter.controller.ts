import { Request, Response } from "express";
import Fighter from "../models/fighter.model";

export const getFighters = async (_req: Request, res: Response) => {
  try {
    const fighters = await Fighter.find();
    res.json(fighters);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch fighters." });
  }
}
