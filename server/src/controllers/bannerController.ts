import { Request, Response } from "express";
import Banner from "../models/bannerModel";
import path from "path";
import { writeFile } from "fs/promises";

export const createBanner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Generate a unique filename
    const uniqueFilename = Date.now() + "-" + file.originalname;
    const uploadPath = path.join(__dirname, "../../uploads", uniqueFilename);

    // Save the file
    await writeFile(uploadPath, file.buffer);

    // Create banner with the file path
    const banner = new Banner({
      title,
      description,
      imageUrl: `/uploads/${uniqueFilename}`,
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ message: "Error creating banner", error });
  }
};

export const getBanners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Error fetching banners", error });
  }
};

export const updateBanner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, isActive } = req.body;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { title, description, imageUrl, isActive, updatedAt: new Date() },
      { new: true }
    );

    if (!banner) {
      res.status(404).json({ message: "Banner not found" });
      return;
    }

    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: "Error updating banner", error });
  }
};

export const deleteBanner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      res.status(404).json({ message: "Banner not found" });
      return;
    }

    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting banner", error });
  }
};
