import { Request, Response } from "express";
import { AuthorModel } from "../models/Author";

export const getAllAuthors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Fetching all authors");
    
    const authors = await AuthorModel.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('authorName authorImage createdAt'); // Only select needed fields

    console.log(`Found ${authors.length} authors`);

    if (!authors.length) {
      res.status(200).json({ 
        message: "Зохиолч олдсонгүй",
        authors: [] 
      });
      return;
    }

    res.status(200).json({
      message: "Зохиолчдын жагсаалт",
      authors
    });
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).json({ 
      message: "Зохиолчдын жагсаалтыг авахад алдаа гарлаа" 
    });
  }
};
