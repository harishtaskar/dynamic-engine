import cors from "cors";
import express from "express";

import { dashboardRouter } from "./routes/dashboard.route";
import { widgetRouter } from "./routes/widget.route";

import { errorHandler } from "./middlewares/error-handler";
import { notFound } from "./middlewares/not-found";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Dynamic Engine API is running",
  });
});

app.use("/api", dashboardRouter);
app.use("/api", widgetRouter);

// If no route matches, return a 404 error
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;