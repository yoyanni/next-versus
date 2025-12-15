// External imports
import mongoose from "mongoose";
import { Request, Response } from "express";

// Internal imports
import Fighter from "../models/fighter.model";

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
  const id = Number(req.params.id);

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
    res.status(500).json({ message: "Failed fetching specific fighter." });
  }
};

/**
 * Even though Mongoose provides some validation via schema,
 * implementing validation with zod might be a good idea.
 */
export const createFighter = async (req: Request, res: Response) => {
  try {
    const lastId = await Fighter.findOne({}, "id").sort({ _id: -1 });
    
    if (!lastId) throw new Error("Issue with locating the latest id.");
    
    req.body._id = ++lastId.id;
    const newFighter = new Fighter(req.body);
    await newFighter.save();
    
    res.status(201).json(newFighter._id);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to create fighter." });
  }
};
