import { Request, Response } from "express";
import { NewsModel } from "../models/news.model";

// **News** оруулах функц
export const createNews = async (req: Request, res: Response) => {
  const { title, description, category, newsImage } = req.body;

  const newNews = new NewsModel({
    title,
    description,
    category,
    newsImage,
  });

  try {
    await newNews.save();
    res.status(201).json({ message: "News created successfully", newNews });
  } catch (error) {
    res.status(500).json({ message: "Error creating news", error });
  }
};

// **News** жагсаалт авах функц
export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await NewsModel.find(); // Бүх news жагсаалт авах
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
};
