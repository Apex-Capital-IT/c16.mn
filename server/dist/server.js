"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const news_routes_1 = __importDefault(require("./routes/news.routes"));
const categoriesRoutes_1 = __importDefault(require("./routes/categoriesRoutes"));
const authorRoutes_1 = __importDefault(require("./routes/authorRoutes"));
const banner_routes_1 = __importDefault(require("./routes/banner.routes"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
// import { ensureDirectories } from "./utils/ensureDirectories";
dotenv_1.default.config();
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)  
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
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
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
        mongodb: mongoose_1.default.connection.readyState === 1 ? "connected" : "disconnected",
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
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage: storage });
// File upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || "Internal Server Error",
            status: err.status || 500,
        },
    });
});
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use("/api/news", news_routes_1.default);
app.use("/api", categoriesRoutes_1.default);
app.use("/api", authorRoutes_1.default);
app.use("/api/banners", banner_routes_1.default);
// MongoDB Connection with retry logic
const connectWithRetry = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log("MONGO_URI:", MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")); // Log URI without credentials
        await mongoose_1.default.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log("MongoDB connected successfully");
        // Start server only after successful database connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (err) {
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
