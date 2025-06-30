"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const basicAuth_1 = require("../middleware/basicAuth");
const router = express_1.default.Router();
// Create a new category
router.post("/create/categories", basicAuth_1.basicAuth, categoryController_1.categoryController);
// Get all categories
router.get("/categories", categoryController_1.getCategoriesController);
exports.default = router;
