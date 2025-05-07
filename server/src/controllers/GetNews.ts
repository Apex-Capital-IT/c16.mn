import { Request, Response } from "express";
import { NewsModel } from "../models/news.model";
import mongoose from "mongoose";

export const getNews = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Check if MongoDB is connected
    if (!NewsModel.db.readyState) {
      console.error("MongoDB is not connected");
      res.status(503).json({
        status: "error",
        message: "Database connection is not ready",
        error: "Database connection error",
      });
      return;
    }

    const news = await NewsModel.find().sort({ createdAt: -1 }).lean(); // Use lean() for better performance

    if (!news || news.length === 0) {
      res.status(200).json({
        status: "success",
        data: [],
        message: "No news articles found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: news,
      count: news.length,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching news",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getNewsById = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("sdf");

  try {
    const { id } = req.params;
    console.log(`Attempting to fetch news with ID: ${id}`);

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`Invalid ObjectId format: ${id}`);
      res.status(400).json({
        message: "Invalid news ID format",
      });
      return;
    }

    // Check if MongoDB is connected
    if (!NewsModel.db.readyState) {
      console.error(`MongoDB connection state: ${NewsModel.db.readyState}`);
      res.status(503).json({
        message: "Database connection is not ready",
      });
      return;
    }

    console.log(`Database connection state: ${NewsModel.db.readyState}`);
    const news = await NewsModel.findById(id).lean();
    console.log(`Query result:`, news ? "Found" : "Not found");

    if (!news) {
      res.status(404).json({
        message: "News article not found",
      });
      return;
    }

    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    console.error("Full error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    res.status(500).json({
      message: "Error fetching news article",
    });
  }
};
