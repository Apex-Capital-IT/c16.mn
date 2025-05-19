import { Request, Response } from "express";
import { AuthorModel } from "../models/Author";
import { NewsModel } from "../models/news.model";

export const deleteAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if author exists
    const existingAuthor = await AuthorModel.findById(id);
    if (!existingAuthor) {
      console.log("Author not found:", id);
      res.status(404).json({ message: "Зохиолч олдсонгүй" });
      return;
    }

    // Check if author has any associated news articles by author ID
    const newsCount = await NewsModel.countDocuments({ authorId: id });
    if (newsCount > 0) {
      console.log(`Author has ${newsCount} associated news articles`);
      res.status(400).json({ 
        message: "Энэ зохиолчтой холбоотой мэдээ байгаа учраас устгах боломжгүй",
        newsCount 
      });
      return;
    }

    // Delete the author
    const deletedAuthor = await AuthorModel.findByIdAndDelete(id);
    if (!deletedAuthor) {
      res.status(404).json({ message: "Зохиолч олдсонгүй" });
      return;
    }

    res.status(200).json({
      message: "Зохиолч амжилттай устгагдлаа",
      author: deletedAuthor
    });
  } catch (error) {
    console.error("Error deleting author:", error);
    res.status(500).json({
      message: "Серверийн алдаа гарлаа",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 