"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNews = void 0;
const news_model_1 = require("../models/news.model");
const getNews = async (_req, res) => {
    try {
        const news = await news_model_1.NewsModel.find()
            .sort({ createdAt: -1 });
        res.status(200).json(news);
    }
    catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Мэдээг татахад алдаа гарлаа", error });
    }
};
exports.getNews = getNews;
