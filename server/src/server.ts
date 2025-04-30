import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import newsRouter from "./routes/news.routes";
import categoryRouter from "./routes/categoriesRoutes";
import authorRouter from "./routes/authorRoutes";
import bannerRouter from "./routes/banner.routes";
import path from "path";
import multer from "multer";
// import { ensureDirectories } from "./utils/ensureDirectories";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "";

// Ensure required directories exist
// ensureDirectories();

// Configure CORS to accept requests from the frontend
const allowedOrigins = [
  "http://localhost:3000", // Local frontend development
  "http://localhost:3002", // Local frontend development
  "http://localhost:8000", // Local backend development
  "https://c16-mn.onrender.com", // Production backend
  "https://c16-mn.vercel.app", // Production frontend
  "https://c16.mn",
  "https://www.c16.mn", // Custom domain if used
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)  
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin); // Log blocked origins for debugging
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
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
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Server is working!",
    environment: process.env.NODE_ENV || "development",
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    allowedOrigins: allowedOrigins,
  });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// File upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      error: {
        message: err.message || "Internal Server Error",
        status: err.status || 500,
      },
    });
  }
);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/news", newsRouter);
app.use("/api", categoryRouter);
app.use("/api", authorRouter);
app.use("/api/banners", bannerRouter);

// MongoDB Connection with retry logic
const connectWithRetry = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log(
      "MONGO_URI:",
      MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")
    ); // Log URI without credentials

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log("MongoDB connected successfully");

    // Start server only after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err: any) {
    console.error("MongoDB connection error:", err);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      code: err.code,
      codeName: err.codeName,
    });

    // Retry connection after 5 seconds
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

// Initial connection attempt
connectWithRetry();
