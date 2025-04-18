"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const categoryRouter = (0, express_1.Router)();
categoryRouter.route("/create/category").post(categoryController_1.categoryController);
categoryRouter.route("/categories").get(categoryController_1.getCategoriesController);
exports.default = categoryRouter;
