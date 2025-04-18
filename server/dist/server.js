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
    "https://a.apex.mn/",
    "http://localhost:3000", // For local dev
    "https://c16-mn.onrender.com", // Add your deployment domain
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
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
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
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
