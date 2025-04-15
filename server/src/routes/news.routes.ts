import express, { RequestHandler } from "express";
import { createNews } from "../controllers/CreateNews";
import { getNews } from "../controllers/GetNews";
import { deleteNews } from "../controllers/DeleteNews";
import { upload } from "../middleware/upload";

const router = express.Router();

router.route("/create/news").post(
  upload.fields([
    { name: 'newsImages', maxCount: 10 }
  ]),
  createNews
);
router.get("/news", getNews);
router.delete("/news/:id", deleteNews as RequestHandler);

export default router;
