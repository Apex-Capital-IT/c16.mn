import express, { RequestHandler } from "express";
import { createNews } from "../controllers/CreateNews";
import { getNews } from "../controllers/GetNews";
import { deleteNews } from "../controllers/DeleteNews";
import { upload } from "../middleware/upload";

const router = express.Router();

// Get all news
router.get("/news", getNews as RequestHandler);

router.route("/create/news").post(
  upload.fields([
    { name: 'newsImages', maxCount: 10 }
  ]),
  createNews
);

// Delete news
router.delete("/news/:id", deleteNews as RequestHandler);

export default router;
