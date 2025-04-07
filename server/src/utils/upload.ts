// utils/upload.ts

import cloudinary from "./cloudinary";

export const uploadImage = async (filePath: string) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "blog_images", // optional folder
    transformation: [
      { width: 800, height: 600, crop: "limit" }, // resize
      { quality: "auto" }, // optimize quality
      { fetch_format: "auto" }, // use best format (webp, etc.)
    ],
  });

  return result.secure_url;
};
