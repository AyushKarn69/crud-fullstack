// Sets up Express application with middleware and route mounting

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import env from "./config/env.js";
import authRoutes from "./routes/v1/auth.routes.js";
import tasksRoutes from "./routes/v1/tasks.routes.js";
import adminRoutes from "./routes/v1/admin.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

export default app;
