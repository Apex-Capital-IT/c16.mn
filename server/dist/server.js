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
const path_1 = __importDefault(require("path"));
// import { ensureDirectories } from "./utils/ensureDirectories";
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "";
// Ensure required directories exist
// ensureDirectories();
// Configure CORS to accept requests from the frontend
const allowedOrigins = [
    "https://a.apex.mn",
    "http://localhost:3000", // Local frontend development
    "http://localhost:8000", // Local backend development
    "https://c16-mn.onrender.com", // Production backend
    "https://c16-mn.vercel.app", // Production frontend
    "https://c16.mn", // Custom domain if used
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log('Blocked origin:', origin); // Log blocked origins for debugging
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
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
        mongodb: mongoose_1.default.connection.readyState === 1 ? "connected" : "disconnected"
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
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use("/api", news_routes_1.default);
app.use("/api", categoriesRoutes_1.default);
app.use("/api", authorRoutes_1.default);
console.log("MONGO_URI: ", MONGO_URI);
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
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
