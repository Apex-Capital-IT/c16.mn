"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Configure multer to use memory storage for Cloudinary uploads
const storage = multer_1.default.memoryStorage();
// Log the storage configuration
console.log("Multer storage configuration:", {
    storageType: storage.constructor.name
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (_req, file, cb) => {
        console.log("Processing file:", {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        });
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            console.error("File rejected - not an image:", file.originalname);
            cb(new Error('Only image files are allowed'));
        }
    }
});
