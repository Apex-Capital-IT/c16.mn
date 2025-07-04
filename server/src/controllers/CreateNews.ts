import { Request, Response } from "express";
import { NewsModel } from "../models/news.model";
import { CategoryModel } from "../models/CategoryModel";
import { AuthorModel } from "../models/Author";
import slugify from "slugify";
import { uploadToCloudinary } from "../utils/cloudinary";

export const createNews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, content, category, authorName, banner } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

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

    if (!files) {
      console.log("No files object in request");
      res.status(400).json({ message: "Зураг оруулах шаардлагатай" });
      return;
    }

    let newsImageFiles: Express.Multer.File[] = [];

    if (Array.isArray(files)) {
      console.log("Files is an array with length:", files.length);
      newsImageFiles = files;
    } else if (files.newsImages) {
      console.log(
        "Files has newsImages property with length:",
        files.newsImages.length
      );
      newsImageFiles = files.newsImages;
    } else {
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

    newsImageFiles.forEach((file, index) => {
      console.log(`File ${index}:`, {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });
    });

    const slug =
      slugify(title, { lower: true, strict: true }) + "-" + Date.now();

    let categoryData;
    if (category) {
      console.log("Looking for category:", category);
      categoryData = await CategoryModel.findOne({ categoryName: category });
      if (!categoryData) {
        console.log("Category not found, creating new category");
        categoryData = new CategoryModel({
          categoryName: category,
          CategoryId: [],
        });
        await categoryData.save();
        console.log("New category created:", categoryData);
      } else {
        console.log("Existing category found:", categoryData);
      }
    }

    console.log("Looking for author:", authorName);
    const author = await AuthorModel.findOne({ authorName });
    if (!author) {
      console.log("Author not found");
      res.status(400).json({ message: "Зохиогч олдсонгүй" });
      return;
    }

    let authorImageUrl = author.authorImage;
    const newsImageUrls: string[] = [];

    for (const file of newsImageFiles) {
      try {
        console.log("Uploading news image to Cloudinary:", file.originalname);
        const result = await uploadToCloudinary(file.buffer, "news");
        newsImageUrls.push((result as any).secure_url);
        console.log(
          "News image uploaded successfully:",
          (result as any).secure_url
        );
      } catch (uploadError) {
        console.error("Error uploading news image to Cloudinary:", uploadError);
      }
    }

    const news = new NewsModel({
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
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({
      message: "Мэдээ үүсгэхэд алдаа гарлаа",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
