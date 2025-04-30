"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.getBanners = exports.createBanner = void 0;
const bannerModel_1 = __importDefault(require("../models/bannerModel"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
const createBanner = async (req, res) => {
    try {
        const { title, description } = req.body;
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        // Generate a unique filename
        const uniqueFilename = Date.now() + "-" + file.originalname;
        const uploadPath = path_1.default.join(__dirname, "../../uploads", uniqueFilename);
        // Save the file
        await (0, promises_1.writeFile)(uploadPath, file.buffer);
        // Create banner with the file path
        const banner = new bannerModel_1.default({
            title,
            description,
            imageUrl: `/uploads/${uniqueFilename}`,
        });
        await banner.save();
        res.status(201).json(banner);
    }
    catch (error) {
        console.error("Error creating banner:", error);
        res.status(500).json({ message: "Error creating banner", error });
    }
};
exports.createBanner = createBanner;
const getBanners = async (req, res) => {
    try {
        const banners = await bannerModel_1.default.find({ isActive: true }).sort({
            createdAt: -1,
        });
        res.json(banners);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching banners", error });
    }
};
exports.getBanners = getBanners;
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, imageUrl, isActive } = req.body;
        const banner = await bannerModel_1.default.findByIdAndUpdate(id, { title, description, imageUrl, isActive, updatedAt: new Date() }, { new: true });
        if (!banner) {
            res.status(404).json({ message: "Banner not found" });
            return;
        }
        res.json(banner);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating banner", error });
    }
};
exports.updateBanner = updateBanner;
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await bannerModel_1.default.findByIdAndDelete(id);
        if (!banner) {
            res.status(404).json({ message: "Banner not found" });
            return;
        }
        res.json({ message: "Banner deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting banner", error });
    }
};
exports.deleteBanner = deleteBanner;
