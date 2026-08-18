import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./db/connect.js";

const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `Dynamic Engine API running on http://localhost:${PORT}`,
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error,
    );

    process.exit(1);
  }
}

startServer();