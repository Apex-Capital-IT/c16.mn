"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNews = void 0;
const news_model_1 = require("../models/news.model");
const getNews = async (_req, res) => {
    try {
        // Check if MongoDB is connected
        if (!news_model_1.NewsModel.db.readyState) {
            console.error("MongoDB is not connected");
            res.status(503).json({
                message: "Database connection is not ready",
                error: "Database connection error"
            });
            return;
        }
        const news = await news_model_1.NewsModel.find()
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance
        if (!news) {
            res.status(404).json({
                message: "No news articles found",
                error: "Not Found"
            });
            return;
        }
        res.status(200).json(news);
    }
    catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({
            message: "Error fetching news",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.getNews = getNews;
