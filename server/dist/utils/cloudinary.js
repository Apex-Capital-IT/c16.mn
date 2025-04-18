"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Log Cloudinary configuration (without sensitive data)
console.log("Cloudinary configuration:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "***" : "missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "missing",
});
// Check if Cloudinary credentials are set
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("Cloudinary credentials are missing. Please check your .env file.");
}
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        if (!fileBuffer || fileBuffer.length === 0) {
            console.error("Empty file buffer provided to uploadToCloudinary");
            return reject(new Error("Empty file buffer provided"));
        }
        console.log(`Uploading file to Cloudinary in folder: ${folder}, size: ${fileBuffer.length} bytes`);
        console.log("File buffer type:", typeof fileBuffer);
        console.log("File buffer is Buffer:", Buffer.isBuffer(fileBuffer));
        console.log("Cloudinary configuration:", {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY ? "***" : "missing",
            api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "missing",
        });
        try {
            const stream = cloudinary_1.v2.uploader.upload_stream({
                folder,
                resource_type: "image",
                use_filename: true,
                unique_filename: true,
                overwrite: true,
            }, (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    console.error("Error details:", JSON.stringify(error, null, 2));
                    return reject(error);
                }
                console.log("Cloudinary upload successful:", {
                    url: result.secure_url,
                    public_id: result.public_id,
                });
                resolve(result);
            });
            // Write the buffer to the stream
            stream.end(fileBuffer);
        }
        catch (error) {
            console.error("Error creating upload stream:", error);
            reject(error);
        }
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
