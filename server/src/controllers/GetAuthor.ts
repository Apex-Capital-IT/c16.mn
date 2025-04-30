import { Request, Response } from "express";
import { AuthorModel } from "../models/Author";

export const getAllAuthors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Fetching all authors");
    
    // Get pagination parameters from query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Optimize query with pagination and select only needed fields
    const authors = await AuthorModel.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('authorName authorImage socialMedia createdAt') // Only select needed fields
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    // Get total count for pagination
    const total = await AuthorModel.countDocuments();

    console.log(`Found ${authors.length} authors (page ${page}, limit ${limit})`);

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
    res.setHeader('X-Total-Count', total.toString());

    if (!authors.length) {
      res.status(200).json({ 
        success: true,
        message: "Зохиолч олдсонгүй",
        authors: [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Зохиолчдын жагсаалт",
      authors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching authors:", error);
    // Ensure we always send a proper JSON response
    res.status(500).json({ 
      success: false,
      message: "Зохиолчдын жагсаалтыг авахад алдаа гарлаа",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
