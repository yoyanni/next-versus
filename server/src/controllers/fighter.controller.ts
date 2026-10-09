// External imports
import mongoose from "mongoose";
import { Request, Response } from "express";

// Internal imports
import { SANDBOX_ID_START } from "@shared/limits";
import Fighter from "../models/fighter.model";

const SANDBOX_MAX_FIGHTERS = 3;

export const getFighters = async (_req: Request, res: Response) => {
  try {
    // lean(): plain objects instead of full Mongoose documents. This returns every fighter
    // (~2.4 MB), so skipping document hydration matters under the 192 MB heap limit.
    const fighters = await Fighter.find().lean();
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
    // The sandbox holds SANDBOX_MAX_FIGHTERS; the oldest ones make room for a new one
    const sandbox = { _id: { $gte: SANDBOX_ID_START } };
    const excess =
      (await Fighter.countDocuments(sandbox)) - SANDBOX_MAX_FIGHTERS + 1;
    if (excess > 0) {
      const oldest = await Fighter.find(sandbox, "_id")
        .sort({ _id: 1 })
        .limit(excess)
        .lean();
      await Fighter.deleteMany({ _id: { $in: oldest.map((f) => f._id) } });
    }

    // Created fighters get sandbox ids: the highest existing one + 1, never below the boundary
    const last = await Fighter.findOne({}, "_id").sort({ _id: -1 }).lean();
    req.body._id = Math.max(last?._id ?? 0, SANDBOX_ID_START - 1) + 1;
    const newFighter = new Fighter(req.body);
    await newFighter.save();

    res.status(201).json(newFighter._id);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to create fighter." });
  }
};

export const editFighter = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const updatedFighter = await Fighter.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedFighter) {
      return res.status(404).json({ message: "Fighter not found" });
    }

    res.status(200).json(updatedFighter._id);
  } catch (error) {
    console.error("Error updating fighter:", error);
    res.status(400).json({ message: "Failed to update fighter." });
  }
};

export const deleteFighter = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const deletedFighter = await Fighter.findByIdAndDelete(id);
    if (!deletedFighter) {
      return res.status(404).json({ message: "Fighter not found" });
    }
    res.status(200).send({ message: "Fighter deleted successfully." });
  } catch (error) {
    console.error("Error deleting fighter:", error);
    res.status(500).json({ message: "Failed to delete fighter." });
  }
};
