import { Request, Response } from "express";
import { NewsModel } from "../models/news.model";

export const deleteNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const deletedNews = await NewsModel.findByIdAndDelete(id);
    
    if (!deletedNews) {
      res.status(404).json({ message: "Мэдээ олдсонгүй" });
      return;
    }
    
    res.status(200).json({ message: "Мэдээ амжилттай устгагдлаа" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ message: "Мэдээг устгахад алдаа гарлаа", error });
  }
}; 