import { Request, Response } from "express";
import { NewsModel } from "../models/news.model";

export const getNews = async (_req: Request, res: Response) => {
  try {
    const news = await NewsModel.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Мэдээг татахад алдаа гарлаа", error });
  }
};
