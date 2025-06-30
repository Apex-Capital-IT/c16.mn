import express from "express";
import {
  categoryController,
  getCategoriesController,
} from "../controllers/categoryController";
import { basicAuth } from "../middleware/basicAuth";

const router = express.Router();

// Create a new category
router.post("/create/categories", basicAuth, categoryController);

// Get all categories
router.get("/categories", getCategoriesController);

export default router;
