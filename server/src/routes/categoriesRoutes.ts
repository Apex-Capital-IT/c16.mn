import { Router } from "express";
import {
  categoryController,
  getCategoriesController,
} from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.route("/create/category").post(categoryController);
categoryRouter.route("/categories").get(getCategoriesController);

export default categoryRouter;
