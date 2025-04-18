"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesController = exports.categoryController = void 0;
const CategoryModel_1 = require("../models/CategoryModel");
const categoryController = async (req, res) => {
    try {
        const { categoryName } = req.body;
        if (!categoryName || !categoryName.trim()) {
            res.status(400).json({ message: "Ангилалын нэр оруулна уу" });
            return;
        }
        // Check for existing category with the same name
        const existingCategory = await CategoryModel_1.CategoryModel.findOne({
            categoryName: categoryName.trim()
        });
        if (existingCategory) {
            res.status(400).json({
                message: "Ийм нэртэй ангилал бүртгэгдсэн байна"
            });
            return;
        }
        const category = await CategoryModel_1.CategoryModel.create({
            categoryName: categoryName.trim(),
        });
        res.status(201).json(category);
    }
    catch (err) {
        console.error("Category create error:", err);
        res.status(500).json({ message: "Category үүсгэхэд алдаа гарлаа" });
    }
};
exports.categoryController = categoryController;
const getCategoriesController = async (req, res) => {
    try {
        const categories = await CategoryModel_1.CategoryModel.find().sort({ createdAt: -1 });
        res.status(200).json({ categories });
    }
    catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ message: "Ангилал авахад алдаа гарлаа" });
    }
};
exports.getCategoriesController = getCategoriesController;
