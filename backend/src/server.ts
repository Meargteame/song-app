import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { User } from "./models/User";
import bcrypt from "bcryptjs";

const PORT = process.env.PORT || 5000;

const seedDemoAccounts = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@auratune.com" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      await User.create({
        name: "AuraTune Admin",
        email: "admin@auratune.com",
        password: hashedPassword,
        role: "admin",
        favorites: [],
      });
      console.log("🔑 Demo Admin account created: admin@auratune.com / admin123");
    }

    const userExists = await User.findOne({ email: "demo@auratune.com" });
    if (!userExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("user123", salt);
      await User.create({
        name: "Demo Listener",
        email: "demo@auratune.com",
        password: hashedPassword,
        role: "user",
        favorites: [],
      });
      console.log("🎵 Demo User account created: demo@auratune.com / user123");
    }
  } catch (err) {
    console.error("Demo account seeding error:", err);
  }
};

const startServer = async (): Promise<void> => {
  // 1. Connect to MongoDB first
  await connectDB();
  await seedDemoAccounts();

  // 2. Start the HTTP server only after DB connection succeeds
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();