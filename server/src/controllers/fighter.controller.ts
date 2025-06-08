import { Request, Response } from "express";
import Fighter from "../models/fighter.model";
import mongoose from "mongoose";

export const getFighters = async (_req: Request, res: Response) => {
  try {
    const fighters = await Fighter.find();
    res.status(200).json(fighters);
  } catch (err) {
    console.error("Error retrieving fighters:", err);
    res.status(500).json({ message: "Server error while fetching fighters." });
  }
};

export const getFighterById = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check for a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const fighter = await Fighter.findById(id);

    if (!fighter) {
      return res.status(404).json({ message: "Fighter not found" });
    }

    res.status(200).json(fighter);
  } catch (error) {
    console.error("Error getting fighter:", error);
    res.status(500).json({ message: "Server error" });
  }
};
