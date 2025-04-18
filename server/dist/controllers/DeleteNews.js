"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNews = void 0;
const news_model_1 = require("../models/news.model");
const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNews = await news_model_1.NewsModel.findByIdAndDelete(id);
        if (!deletedNews) {
            return res.status(404).json({ message: "Мэдээ олдсонгүй" });
        }
        res.status(200).json({ message: "Мэдээ амжилттай устгагдлаа" });
    }
    catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ message: "Мэдээг устгахад алдаа гарлаа", error });
    }
};
exports.deleteNews = deleteNews;
