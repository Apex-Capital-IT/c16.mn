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
app.use(
  cors({
    origin: ["https://a.apex.mn/", "http://127.0.0.1:3000", "https://c16-mn.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
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
      console.log(`Server running on http://localhost:${PORT}`)
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
