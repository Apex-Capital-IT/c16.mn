import { Router } from "express";
import { createNews, getNews } from "../controllers/news.controller";

const router = Router();

// **news** оруулах
router.post("/create/news", createNews);
// **news** жагсаалт авах
router.get("/news", getNews);

export default router;
