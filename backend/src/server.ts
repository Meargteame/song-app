import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  // 1. Connect to MongoDB first
  await connectDB();

  // 2. Start the HTTP server only after DB connection succeeds
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();