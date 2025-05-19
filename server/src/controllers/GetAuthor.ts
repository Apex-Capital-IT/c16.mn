import { Request, Response } from "express";
import { AuthorModel } from "../models/Author";
import mongoose from "mongoose";

export const getAuthorById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Attempting to fetch author with ID: ${id}`);

    if (AuthorModel.db.readyState !== 1) {
      console.error(
        "MongoDB is not connected. Connection state:",
        AuthorModel.db.readyState
      );
      res.status(503).json({
        status: "error",
        message: "Database connection is not ready",
        error: "Database connection error",
      });
      return;
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId:", id);
      res.status(400).json({
        status: "error",
        message: "Зохиолчийн ID буруу байна",
        error: "Validation error",
      });
      return;
    }

    const author = await AuthorModel.findById(id)
      .select("authorName authorImage socialMedia createdAt updatedAt")
      .lean();
    console.log("Database query result:", author);

    if (!author) {
      console.log("Author not found:", id);
      res.status(404).json({
        status: "error",
        message: "Зохиолч олдсонгүй",
        error: "Not Found",
      });
      return;
    }

    // console.log("Author found:", author);
    res.status(200).json({
      status: "success",
      message: "Зохиолч амжилттай олдлоо",
      data: author,
    });
  } catch (error) {
    console.error("Error fetching author:", error);
    res.status(500).json({
      status: "error",
      message: "Зохиолч авахад алдаа гарлаа",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

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
      .select("authorName authorImage socialMedia createdAt") // Only select needed fields
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    // Get total count for pagination
    const total = await AuthorModel.countDocuments();

    console.log(
      `Found ${authors.length} authors (page ${page}, limit ${limit})`
    );

    // Set cache headers
    res.setHeader("Cache-Control", "public, max-age=60"); // Cache for 1 minute
    res.setHeader("X-Total-Count", total.toString());

    if (!authors.length) {
      res.status(200).json({
        status: "success",
        message: "Зохиолч олдсонгүй",
        data: [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Зохиолчдын жагсаалт",
      data: authors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).json({
      status: "error",
      message: "Зохиолчдын жагсаалт авахад алдаа гарлаа",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
