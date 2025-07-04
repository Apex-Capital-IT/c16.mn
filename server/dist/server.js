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
const adminAuth_routes_1 = __importDefault(require("./routes/adminAuth.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
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
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        mongodb: mongoose_1.default.connection.readyState === 1 ? "connected" : "disconnected",
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
app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
});
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || "Internal Server Error",
            status: err.status || 500,
        },
    });
});
app.use("/api", adminAuth_routes_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use("/api/news", news_routes_1.default);
app.use("/api", categoriesRoutes_1.default);
app.use("/api", authorRoutes_1.default);
app.use("/api/banners", banner_routes_1.default);
const connectWithRetry = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log("MONGO_URI:", MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"));
        await mongoose_1.default.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected successfully");
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
        console.log("Retrying connection in 5 seconds...");
        setTimeout(connectWithRetry, 5000);
    }
};
connectWithRetry();
