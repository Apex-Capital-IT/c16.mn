"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNews = void 0;
const news_model_1 = require("../models/news.model");
const CategoryModel_1 = require("../models/CategoryModel");
const Author_1 = require("../models/Author");
const slugify_1 = __importDefault(require("slugify"));
const cloudinary_1 = require("../utils/cloudinary");
const createNews = async (req, res) => {
    try {
        const { title, content, category, authorName, banner } = req.body;
        const files = req.files;
        // Validate required fields
        if (!title || !content || !category || !authorName) {
            console.log("Missing required fields:", {
                title: !title,
                content: !content,
                category: !category,
                authorName: !authorName,
            });
            res.status(400).json({
                message: "Шаардлагатай талбарууд дутуу байна",
                missingFields: {
                    title: !title,
                    content: !content,
                    category: !category,
                    authorName: !authorName,
                },
            });
            return;
        }
        // Validate files
        if (!files) {
            console.log("No files object in request");
            res.status(400).json({ message: "Зураг оруулах шаардлагатай" });
            return;
        }
        // Check if files is an array (direct array) or an object with newsImages property
        let newsImageFiles = [];
        if (Array.isArray(files)) {
            console.log("Files is an array with length:", files.length);
            newsImageFiles = files;
        }
        else if (files.newsImages) {
            console.log("Files has newsImages property with length:", files.newsImages.length);
            newsImageFiles = files.newsImages;
        }
        else {
            console.log("Files object structure:", Object.keys(files));
            res.status(400).json({ message: "Зураг оруулах шаардлагатай" });
            return;
        }
        if (newsImageFiles.length === 0) {
            console.log("No news images found in files");
            res.status(400).json({ message: "Зураг оруулах шаардлагатай" });
            return;
        }
        console.log("Files received:", files);
        console.log("News images count:", newsImageFiles.length);
        // Log each file for debugging
        newsImageFiles.forEach((file, index) => {
            console.log(`File ${index}:`, {
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
            });
        });
        const slug = (0, slugify_1.default)(title, { lower: true, strict: true }) + "-" + Date.now();
        // console.log("Generated slug:", slug);
        // Handle category
        let categoryData;
        if (category) {
            console.log("Looking for category:", category);
            categoryData = await CategoryModel_1.CategoryModel.findOne({ categoryName: category });
            if (!categoryData) {
                console.log("Category not found, creating new category");
                categoryData = new CategoryModel_1.CategoryModel({
                    categoryName: category,
                    CategoryId: [],
                });
                await categoryData.save();
                console.log("New category created:", categoryData);
            }
            else {
                console.log("Existing category found:", categoryData);
            }
        }
        // Find the author to get their image
        console.log("Looking for author:", authorName);
        const author = await Author_1.AuthorModel.findOne({ authorName });
        if (!author) {
            console.log("Author not found");
            res.status(400).json({ message: "Зохиогч олдсонгүй" });
            return;
        }
        // console.log("Author found:", author);
        let authorImageUrl = author.authorImage;
        // console.log("Using author image:", authorImageUrl);
        // Upload news images
        const newsImageUrls = [];
        for (const file of newsImageFiles) {
            try {
                console.log("Uploading news image to Cloudinary:", file.originalname);
                const result = await (0, cloudinary_1.uploadToCloudinary)(file.buffer, "news");
                newsImageUrls.push(result.secure_url);
                console.log("News image uploaded successfully:", result.secure_url);
            }
            catch (uploadError) {
                console.error("Error uploading news image to Cloudinary:", uploadError);
                // Continue with other images even if one fails
            }
        }
        // Creating a new news entry
        // console.log("Creating new news entry with data:", {
        //   title,
        //   content,
        //   authorName,
        //   authorImage: authorImageUrl,
        //   category: categoryData ? categoryData.categoryName : category,
        //   newsImages: newsImageUrls,
        //   banner: banner || false,
        //   slug,
        // });
        const news = new news_model_1.NewsModel({
            title,
            content,
            authorName,
            authorImage: authorImageUrl,
            category: categoryData ? categoryData.categoryName : category,
            newsImages: newsImageUrls,
            banner: banner || false,
            slug,
        });
        await news.save();
        // console.log("News created successfully:", news._id);
        res.status(201).json({
            message: "Мэдээ амжилттай үүслээ",
            news: {
                _id: news._id,
                title: news.title,
                slug: news.slug,
                authorName: news.authorName,
                category: news.category,
            },
        });
    }
    catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({
            message: "Мэдээ үүсгэхэд алдаа гарлаа",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createNews = createNews;
