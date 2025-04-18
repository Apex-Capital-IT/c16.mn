"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAuthors = void 0;
const Author_1 = require("../models/Author");
const getAllAuthors = async (req, res) => {
    try {
        console.log("Fetching all authors");
        const authors = await Author_1.AuthorModel.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .select('authorName authorImage createdAt'); // Only select needed fields
        console.log(`Found ${authors.length} authors`);
        if (!authors.length) {
            res.status(200).json({
                message: "Зохиолч олдсонгүй",
                authors: []
            });
            return;
        }
        res.status(200).json({
            message: "Зохиолчдын жагсаалт",
            authors
        });
    }
    catch (error) {
        console.error("Error fetching authors:", error);
        res.status(500).json({
            message: "Зохиолчдын жагсаалтыг авахад алдаа гарлаа"
        });
    }
};
exports.getAllAuthors = getAllAuthors;
