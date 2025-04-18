import express from "express";
import {
  categoryController,
  getCategoriesController,
} from "../controllers/categoryController";

const router = express.Router();

// Create a new category
router.post("/create/categories", categoryController);

// Get all categories
router.get("/categories", getCategoriesController);

export default router;
