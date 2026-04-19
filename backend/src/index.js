// Starts the Express server and initializes database connection

import app from "./app.js";
import env from "./config/env.js";
import prisma from "./config/db.js";
import { connectMongo, disconnectMongo } from "./config/mongo.js";

const PORT = env.PORT;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected");
    
    await connectMongo();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  await disconnectMongo();
  process.exit(0);
});
