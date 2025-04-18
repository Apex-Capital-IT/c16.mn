"use strict";
// import mongoose from "mongoose";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsModel = void 0;
// const newsSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   category: { type: String, required: true },
//   newsImage: { type: String },
//   authorName: { type: String },
//   authorImage: { type: String },
//   slug: {
//     type: String,
//     required: true,
//     unique: true,
//   },
// });
// export const NewsModel = mongoose.model("News", newsSchema);
const mongoose_1 = require("mongoose");
const newsSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    newsImages: [{ type: String }],
    authorName: { type: String, required: true },
    authorImage: { type: String },
    banner: { type: Boolean, default: false },
    slug: { type: String, unique: true, required: true },
}, { timestamps: true });
exports.NewsModel = (0, mongoose_1.model)("News", newsSchema);
