import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import newsRouter from "./routes/news.routes";
import categoryRouter from "./routes/categoriesRoutes";
import authorRouter from "./routes/authorRoutes";
import path from "path";
// import { ensureDirectories } from "./utils/ensureDirectories";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "";

// Ensure required directories exist
// ensureDirectories();

// Configure CORS to accept requests from the frontend
const allowedOrigins = [
  "https://a.apex.mn",
  "http://localhost:3000",     // Local frontend development
  "http://localhost:8000",     // Local backend development
  "https://c16-mn.onrender.com", // Production backend
  "https://c16-mn.vercel.app",   // Production frontend
  "https://c16.mn",              // Custom domain if used
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin); // Log blocked origins for debugging
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    credentials: true,
    maxAge: 86400, // CORS preflight cache for 24 hours
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Server is working!",
    environment: process.env.NODE_ENV || "development",
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    allowedOrigins: allowedOrigins
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", newsRouter);
app.use("/api", categoryRouter);
app.use("/api", authorRouter);

console.log("MONGO_URI: ", MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      code: err.code,
      codeName: err.codeName,
    });
  });
