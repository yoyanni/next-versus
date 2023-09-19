// External Imports
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";

// Middleware
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const initMongoose = require("./mongoose-config");
initMongoose(process.env.DATABASE_URL);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
