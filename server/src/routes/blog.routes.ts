import express from "express";
import { createBlog, getBlogs } from "../controllers/blog.controller";

const router = express.Router();

// ✅ Блог үүсгэх зам
router.post("/create", createBlog);

// ✅ Блог шүүх зам
router.get("/filter", getBlogs);

export default router;
