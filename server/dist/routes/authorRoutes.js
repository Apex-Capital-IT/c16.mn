"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GetAuthor_1 = require("../controllers/GetAuthor");
const createAuthor_1 = require("../controllers/createAuthor");
const UpdateAuthor_1 = require("../controllers/UpdateAuthor");
const DeleteAuthor_1 = require("../controllers/DeleteAuthor");
const multer_1 = __importDefault(require("multer"));
const authorRouter = express_1.default.Router();
// Configure multer for author image uploads using memory storage for Cloudinary
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Зөвхөн зураг файл оруулах боломжтой'));
        }
    }
});
// Get all authors with pagination
authorRouter.get("/authors", GetAuthor_1.getAllAuthors);
// Get author by ID
authorRouter.get("/authors/:id", GetAuthor_1.getAuthorById);
// Create new author
authorRouter.post("/authors", upload.single("authorImage"), createAuthor_1.createAuthor);
// Update author
authorRouter.put("/authors/:id", upload.single("authorImage"), UpdateAuthor_1.updateAuthor);
// Delete author
authorRouter.delete("/authors/:id", DeleteAuthor_1.deleteAuthor);
exports.default = authorRouter;
