import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import healthRouter from "./routes/health.route";

import authRouter from "./modules/auth/auth.route";
import categoryRouter from "./modules/category/category.route";
import productRouter from "./modules/product/product.route";

const app: Application = express();

/**
 * Global Middlewares
 */
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000", // We'll move this to .env later
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

/**
 * Routes
 */
app.use("/api/v1/health", healthRouter);
// Authentication
app.use("/api/v1/auth", authRouter);

// Categories
app.use("/api/v1/categories", categoryRouter);

// Products
app.use("/api/v1/products", productRouter);

/**
 * 404 Route Handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

/**
 * Global Error Handler
 */
app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
);

export default app;