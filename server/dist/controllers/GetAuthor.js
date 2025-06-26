"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAuthors = exports.getAuthorById = void 0;
const Author_1 = require("../models/Author");
const mongoose_1 = __importDefault(require("mongoose"));
const getAuthorById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to fetch author with ID: ${id}`);
        if (Author_1.AuthorModel.db.readyState !== 1) {
            console.error("MongoDB is not connected. Connection state:", Author_1.AuthorModel.db.readyState);
            res.status(503).json({
                status: "error",
                message: "Database connection is not ready",
                error: "Database connection error",
            });
            return;
        }
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            console.log("Invalid ObjectId:", id);
            res.status(400).json({
                status: "error",
                message: "Зохиолчийн ID буруу байна",
                error: "Validation error",
            });
            return;
        }
        const author = await Author_1.AuthorModel.findById(id)
            .select("authorName authorImage socialMedia createdAt updatedAt")
            .lean();
        console.log("Database query result:", author);
        if (!author) {
            console.log("Author not found:", id);
            res.status(404).json({
                status: "error",
                message: "Зохиолч олдсонгүй!",
                error: "Not Found",
            });
            return;
        }
        // console.log("Author found:", author);
        res.status(200).json({
            status: "success",
            message: "Зохиолч амжилттай олдлоо",
            data: author,
        });
    }
    catch (error) {
        console.error("Error fetching author:", error);
        res.status(500).json({
            status: "error",
            message: "Зохиолч авахад алдаа гарлаа",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getAuthorById = getAuthorById;
const getAllAuthors = async (req, res) => {
    try {
        console.log("Fetching all authors");
        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Optimize query with pagination and select only needed fields
        const authors = await Author_1.AuthorModel.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .select("authorName authorImage socialMedia createdAt") // Only select needed fields
            .skip(skip)
            .limit(limit)
            .lean(); // Use lean() for better performance
        // Get total count for pagination
        const total = await Author_1.AuthorModel.countDocuments();
        console.log(`Found ${authors.length} authors (page ${page}, limit ${limit})`);
        // Set cache headers
        res.setHeader("Cache-Control", "public, max-age=60"); // Cache for 1 minute
        res.setHeader("X-Total-Count", total.toString());
        if (!authors.length) {
            res.status(200).json({
                status: "success",
                message: "Зохиолч олдсонгүй!",
                data: [],
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            });
            return;
        }
        res.status(200).json({
            status: "success",
            message: "Зохиолчдын жагсаалт",
            data: authors,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error("Error fetching authors:", error);
        res.status(500).json({
            status: "error",
            message: "Зохиолчдын жагсаалт авахад алдаа гарлаа",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getAllAuthors = getAllAuthors;
