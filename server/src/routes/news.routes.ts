import express, { RequestHandler } from "express";
import { createNews } from "../controllers/CreateNews";
import { getNews, getNewsById } from "../controllers/GetNews";
import { deleteNews } from "../controllers/DeleteNews";
import { updateNews } from "../controllers/UpdateNews";
import { upload, logRequest } from "../middleware/upload";

const router = express.Router();

// Get all news
router.get("/", getNews as RequestHandler);

// Get single news by ID
router.get("/:id", getNewsById as RequestHandler);

// Get news for editing
router.get("/edit/:id", getNewsById as RequestHandler);

// Create news - add logging middleware and fix file upload
// Make sure to use the exact field name expected by the frontend
router.post("/", logRequest, upload.array("newsImages", 10), createNews as RequestHandler);

// Update news
router.put("/:id", logRequest, upload.array("newsImages", 10), updateNews as RequestHandler);

// Delete news
router.delete("/:id", deleteNews as RequestHandler);

export default router;
