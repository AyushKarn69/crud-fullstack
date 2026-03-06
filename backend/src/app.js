// Sets up Express application with middleware and route mounting

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import env from "./config/env.js";
import swaggerSpec from "./config/swagger.js";
import authRoutes from "./routes/v1/auth.routes.js";
import tasksRoutes from "./routes/v1/tasks.routes.js";
import adminRoutes from "./routes/v1/admin.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Rate limiting disabled in development for testing; enable in production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === "production" ? 100 : 1000,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

export default app;
