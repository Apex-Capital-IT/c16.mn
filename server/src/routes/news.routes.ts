import express from "express";
import { createNews } from "../controllers/CreateNews";
import { getNews } from "../controllers/GetNews";

const router = express.Router();

router.post("/create/news", createNews);
router.get("/news", getNews);

export default router;
