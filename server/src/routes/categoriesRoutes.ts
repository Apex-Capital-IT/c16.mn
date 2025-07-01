import express from "express";
import {
  categoryController,
  getCategoriesController,
} from "../controllers/categoryController";
import { basicAuth } from "../middleware/basicAuth";

const router = express.Router();

router.post("/create/categories", basicAuth, categoryController);

router.get("/categories", getCategoriesController);

export default router;
