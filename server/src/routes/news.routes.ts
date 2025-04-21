import express, { RequestHandler } from "express";
import { createNews } from "../controllers/CreateNews";
import { getNews } from "../controllers/GetNews";
import { deleteNews } from "../controllers/DeleteNews";
import { upload, logRequest } from "../middleware/upload";

const router = express.Router();

// Get all news
router.get("/", getNews as RequestHandler);

// Create news - add logging middleware and fix file upload
// Make sure to use the exact field name expected by the frontend
router.post("/", logRequest, upload.array("newsImages", 10), createNews as RequestHandler);

// Delete news
router.delete("/:id", deleteNews as RequestHandler);

export default router;
