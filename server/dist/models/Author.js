"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorModel = void 0;
const mongoose_1 = require("mongoose");
const AuthorSchema = new mongoose_1.Schema({
    authorName: { type: String, required: true, unique: true },
    authorImage: { type: String },
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });
exports.AuthorModel = mongoose_1.models.Author || (0, mongoose_1.model)("Author", AuthorSchema);
