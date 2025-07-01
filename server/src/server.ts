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
import adminAuthRouter from "./routes/adminAuth.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:8000", 
  "https://c16-mn.onrender.com", 
  "https://c16-mn.vercel.app", 
  "https://c16.mn",
  "https://www.c16.mn", 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin); 
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
    maxAge: 86400, 
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Server is working!",
    environment: process.env.NODE_ENV || "development",
    apiUrl: NEXT_PUBLIC_API_URL,
    allowedOrigins: allowedOrigins,
  });
});

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

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

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

app.use("/api", adminAuthRouter);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/news", newsRouter);
app.use("/api", categoryRouter);
app.use("/api", authorRouter);
app.use("/api/banners", bannerRouter);

const connectWithRetry = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log(
      "MONGO_URI:",
      MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")
    ); 

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB connected successfully");

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

    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();
