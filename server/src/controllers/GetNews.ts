import { Request, Response } from "express";
import { NewsModel } from "../models/news.model";

export const getNews = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Check if MongoDB is connected
    if (!NewsModel.db.readyState) {
      console.error("MongoDB is not connected");
      res.status(503).json({ 
        message: "Database connection is not ready",
        error: "Database connection error"
      });
      return;
    }

    const news = await NewsModel.find()
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
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ 
      message: "Error fetching news", 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
