import { Request, Response } from "express";
import { AuthorModel } from "../models/Author";
import { uploadToCloudinary } from "../utils/cloudinary";

export const createAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Received author creation request:", {
    body: req.body,
    file: req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    } : "No file",
  });

  const { authorName } = req.body;
  const file = req.file;

  try {
    // Validate input
    if (!authorName || authorName.trim().length === 0) {
      console.log("Validation error: Missing author name");
      res.status(400).json({ message: "Зохиолчийн нэр оруулна уу" });
      return;
    }

    const existingAuthor = await AuthorModel.findOne({ 
      authorName: { $regex: new RegExp(`^${authorName}$`, 'i') }
    });
    
    if (existingAuthor) {
      console.log("Validation error: Author already exists", existingAuthor);
      res.status(400).json({ message: "Энэ нэртэй зохиолч аль хэдийн байна" });
      return;
    }

    // Validate image
    if (!file) {
      console.log("Validation error: Missing author image");
      res.status(400).json({ message: "Зохиолчийн зураг оруулах шаардлагатай" });
      return;
    }

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      console.log("Validation error: Invalid file type", file.mimetype);
      res.status(400).json({ message: "Зөвхөн зураг файл оруулах боломжтой" });
      return;
    }

    // Handle image upload
    let imageUrl: string;
    try {
      console.log("Uploading author image to Cloudinary...");
      const result = await uploadToCloudinary(file.buffer, 'authors');
      imageUrl = (result as any).secure_url;
      console.log("Author image uploaded successfully:", imageUrl);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      res.status(500).json({ 
        message: "Зураг оруулахад алдаа гарлаа",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return;
    }

    // Create new author
    const newAuthor = new AuthorModel({
      authorName: authorName.trim(),
      authorImage: imageUrl,
    });

    const savedAuthor = await newAuthor.save();
    console.log("Author saved successfully:", savedAuthor);

    res.status(201).json({
      message: "Зохиолч амжилттай үүслээ",
      author: savedAuthor,
    });
  } catch (error) {
    console.error("Error creating author:", error);
    res.status(500).json({ 
      message: "Серверийн алдаа гарлаа",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
