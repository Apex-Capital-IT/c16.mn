import express, { RequestHandler } from "express";
import { createNews } from "../controllers/CreateNews";
import { getNews } from "../controllers/GetNews";
import { deleteNews } from "../controllers/DeleteNews";
import { upload } from "../middleware/upload";

const router = express.Router();

// Get all news
router.get("/", getNews as RequestHandler);

// Create news
router.post("/", upload.single("image"), createNews as RequestHandler);

// Delete news
router.delete("/:id", deleteNews as RequestHandler);

export default router;
