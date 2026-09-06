import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import songRoutes from "./routes/songRoutes";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";

// 1. Load environment variables from .env
dotenv.config();

// 2. Initialize the Express application
const app: Application = express();

// 3. Security & Body Parsing Middleware
app.use(cors());
app.use(express.json());

// 4. Mount API Routes
app.use("/api/songs", songRoutes);
app.use("/api/auth", authRoutes);

// 5. Health Check Endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is healthy and running" });
});

// 6. Centralized Error Handler (MUST be registered last)
app.use(errorHandler);

export default app;