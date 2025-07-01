import { Request, Response } from "express";
import { NewsModel } from "../models/news.model";
import { uploadToCloudinary } from "../utils/cloudinary";

export const updateNews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, category, authorName, banner, existingImages } =
      req.body;

    if (!NewsModel.db.readyState) {
      console.error("MongoDB is not connected");
      res.status(503).json({
        status: "error",
        message: "Database connection is not ready",
        error: "Database connection error",
      });
      return;
    }

    const currentNews = await NewsModel.findById(id);
    if (!currentNews) {
      res.status(404).json({
        status: "error",
        message: "News article not found",
        error: "Not Found",
      });
      return;
    }

    // Parse existingImages if it's a string and not empty
    let parsedExistingImages: string[] = [];
    if (existingImages) {
      try {
        parsedExistingImages = typeof existingImages === "string"
          ? JSON.parse(existingImages)
          : existingImages;
        
        // Filter out any invalid image URLs and ensure they are Cloudinary URLs
        parsedExistingImages = parsedExistingImages.filter(url => 
          url && 
          typeof url === 'string' && 
          (url.startsWith('https://res.cloudinary.com') || url.startsWith('http://res.cloudinary.com'))
        );
      } catch (error) {
        console.error("Error parsing existingImages:", error);
        parsedExistingImages = [];
      }
    }

    // Get new uploaded files and upload them to Cloudinary
    const newImages: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        try {
          console.log("Uploading news image to Cloudinary:", file.originalname);
          const result = await uploadToCloudinary(file.buffer, 'news');
          if (result && (result as any).secure_url) {
            newImages.push((result as any).secure_url);
            console.log("News image uploaded successfully:", (result as any).secure_url);
          }
        } catch (uploadError) {
          console.error("Error uploading news image to Cloudinary:", uploadError);
          // Continue with other images even if one fails
        }
      }
    }

    // Combine existing and new images, ensuring no duplicates and valid URLs
    const allImages = [...new Set([...parsedExistingImages, ...newImages])].filter(url => 
      url && typeof url === 'string' && (url.startsWith('https://res.cloudinary.com') || url.startsWith('http://res.cloudinary.com'))
    );

    // Remove the condition that keeps existing images when no valid images are present
    // This allows complete deletion of images when none are provided

    const updatedNews = await NewsModel.findByIdAndUpdate(
      id,
      {
        title,
        content,
        category,
        authorName,
        banner: banner === "true",
        newsImages: allImages,
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();

    if (!updatedNews) {
      res.status(404).json({
        status: "error",
        message: "News article not found",
        error: "Not Found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: updatedNews,
      message: "News article updated successfully",
    });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating news article",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
