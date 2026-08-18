import "dotenv/config";

import mongoose from "mongoose";

import { connectDatabase } from "./db/connect";
import { seedDashboards } from "./seeds/dashboard.seed";

async function runSeed() {
  try {
    await connectDatabase();

    await seedDashboards();

    console.log("Database seeding completed");

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error(
      "Database seeding failed:",
      error,
    );

    await mongoose.disconnect();

    process.exit(1);
  }
}

runSeed();