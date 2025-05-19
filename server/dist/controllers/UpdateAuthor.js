"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAuthor = void 0;
const Author_1 = require("../models/Author");
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const { authorName, socialMedia, existingAuthorImage } = req.body;
        const file = req.file;
        console.log("Update author request:", {
            id,
            authorName,
            socialMedia,
            existingAuthorImage,
            hasFile: !!file,
            fileDetails: file
                ? {
                    fieldname: file.fieldname,
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    buffer: file.buffer ? "Buffer exists" : "No buffer",
                }
                : null,
        });
        // Check if MongoDB is connected
        if (!Author_1.AuthorModel.db.readyState) {
            console.error("MongoDB is not connected");
            res.status(503).json({
                status: "error",
                message: "Database connection is not ready",
                error: "Database connection error",
            });
            return;
        }
        // Validate input
        if (!authorName || authorName.trim().length === 0) {
            console.log("Validation error: Missing author name");
            res.status(400).json({
                status: "error",
                message: "Зохиолчийн нэр оруулна уу",
                error: "Validation error",
            });
            return;
        }
        // Check if author exists
        const existingAuthor = await Author_1.AuthorModel.findById(id);
        if (!existingAuthor) {
            console.log("Author not found:", id);
            res.status(404).json({
                status: "error",
                message: "Зохиолч олдсонгүй",
                error: "Not Found",
            });
            return;
        }
        // Check if new name conflicts with other authors
        if (authorName !== existingAuthor.authorName) {
            const nameConflict = await Author_1.AuthorModel.findOne({
                authorName: { $regex: new RegExp(`^${authorName}$`, "i") },
                _id: { $ne: id },
            });
            if (nameConflict) {
                console.log("Validation error: Author name already exists");
                res.status(400).json({
                    status: "error",
                    message: "Энэ нэртэй зохиолч аль хэдийн байна",
                    error: "Validation error",
                });
                return;
            }
        }
        // Handle image update
        let imageUrl = existingAuthor.authorImage; // Keep existing image by default
        // If existingAuthorImage is provided, validate and use it
        if (existingAuthorImage) {
            try {
                // Validate that it's a Cloudinary URL
                if (existingAuthorImage.startsWith("https://res.cloudinary.com") ||
                    existingAuthorImage.startsWith("http://res.cloudinary.com")) {
                    imageUrl = existingAuthorImage;
                    console.log("Using existing Cloudinary image:", imageUrl);
                }
                else {
                    console.log("Invalid Cloudinary URL:", existingAuthorImage);
                }
            }
            catch (error) {
                console.error("Error validating existingAuthorImage:", error);
            }
        }
        // If a new file is uploaded, upload it to Cloudinary
        if (file) {
            try {
                // Validate file type
                if (!file.mimetype.startsWith("image/")) {
                    console.log("Validation error: Invalid file type", file.mimetype);
                    res.status(400).json({
                        status: "error",
                        message: "Зөвхөн зураг файл оруулах боломжтой",
                        error: "Validation error",
                    });
                    return;
                }
                // Validate file buffer
                if (!file.buffer) {
                    throw new Error("File buffer is missing");
                }
                // Convert buffer to base64
                const base64Image = file.buffer.toString("base64");
                const dataURI = `data:${file.mimetype};base64,${base64Image}`;
                // Upload to Cloudinary
                const result = await cloudinary_1.v2.uploader.upload(dataURI, {
                    folder: "authors",
                    resource_type: "auto",
                    transformation: [
                        { width: 800, height: 800, crop: "fill" },
                        { quality: "auto" },
                        { fetch_format: "auto" },
                    ],
                });
                if (!result || !result.secure_url) {
                    throw new Error("Cloudinary upload failed - no secure URL returned");
                }
                imageUrl = result.secure_url;
                console.log("Author image uploaded successfully:", imageUrl);
            }
            catch (uploadError) {
                console.error("Error uploading author image to Cloudinary:", uploadError);
                res.status(500).json({
                    status: "error",
                    message: "Зураг оруулахад алдаа гарлаа",
                    error: uploadError instanceof Error
                        ? uploadError.message
                        : "Unknown error",
                });
                return;
            }
        }
        // Update author
        const updatedAuthor = await Author_1.AuthorModel.findByIdAndUpdate(id, {
            authorName: authorName.trim(),
            authorImage: imageUrl,
            socialMedia: socialMedia?.trim(),
            updatedAt: new Date(),
        }, { new: true }).lean();
        if (!updatedAuthor) {
            console.log("Author not found after update:", id);
            res.status(404).json({
                status: "error",
                message: "Зохиолч олдсонгүй",
                error: "Not Found",
            });
            return;
        }
        console.log("Author updated successfully:", updatedAuthor._id);
        res.status(200).json({
            status: "success",
            message: "Зохиолч амжилттай шинэчлэгдлээ",
            data: updatedAuthor,
        });
    }
    catch (error) {
        console.error("Error updating author:", error);
        res.status(500).json({
            status: "error",
            message: "Серверийн алдаа гарлаа",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.updateAuthor = updateAuthor;
