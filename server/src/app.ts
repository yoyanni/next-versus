// External Imports
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Local Imports
import fighterRouter from "./routes/fighter.routes";

// Initialise app details
const app = express();

// Middleware
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api", fighterRouter);

export default app;
