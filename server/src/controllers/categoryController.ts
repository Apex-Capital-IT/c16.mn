import { Request, Response } from "express";
import { CategoryModel } from "../models/CategoryModel";

export const categoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryName } = req.body;

    if (!categoryName || !categoryName.trim()) {
      res.status(400).json({ message: "Ангилалын нэр оруулна уу" });
      return;
    }

    // Check for existing category with the same name
    const existingCategory = await CategoryModel.findOne({ 
      categoryName: categoryName.trim() 
    });

    if (existingCategory) {
      res.status(400).json({ 
        message: "Ийм нэртэй ангилал бүртгэгдсэн байна" 
      });
      return;
    }

    const category = await CategoryModel.create({
      categoryName: categoryName.trim(),
    });

    res.status(201).json(category);
  } catch (err) {
    console.error("Category create error:", err);
    res.status(500).json({ message: "Category үүсгэхэд алдаа гарлаа" });
  }
};

export const getCategoriesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });
    res.status(200).json({ categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Ангилал авахад алдаа гарлаа" });
  }
};
