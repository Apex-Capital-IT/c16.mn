import { Request, Response } from "express";
import { NewsModel } from "../models/news.model";
import slugify from "slugify";

export const createNews = async (req: Request, res: Response) => {
  const { title, content, category, newsImage, authorName, authorImage } =
    req.body;

  const slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now();

  try {
    const news = new NewsModel({
      title,
      content,
      category,
      newsImage,
      authorName,
      authorImage,
      slug,
    });

    await news.save();

    res.status(201).json({ message: "Мэдээ амжилттай үүслээ", news });
  } catch (error) {
    res.status(500).json({ message: "Мэдээ үүсгэхэд алдаа гарлаа", error });
  }
};
