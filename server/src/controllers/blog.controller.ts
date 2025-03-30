import { Request, Response } from "express";
import blogModel from "../models/blog.model";

// ✅ Блог үүсгэх
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, image, activeDays } = req.body;
    const blog = new blogModel({ title, content, image, activeDays });
    await blog.save();

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to create blog" });
  }
};

// ✅ Блог шүүх (filter)
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { activeDays } = req.query;

    let filter = {};
    if (activeDays) {
      const days = Number(activeDays);
      const date = new Date();
      date.setDate(date.getDate() - days);
      filter = { createdAt: { $gte: date } };
    }

    const blogs = await blogModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};
