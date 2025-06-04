// External Imports
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";

// Local Imports
import Fighter from "./fighter";
import { connectDB } from "./config/db";


// Middleware
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
await connectDB();

// Route
app.get("/api/fighters", async (req: Request, res: Response) => {
  try {
    const fighters = await Fighter.find();
    res.json(fighters);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch fighters." });
  }
});

// Set Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
