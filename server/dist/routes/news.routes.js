"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CreateNews_1 = require("../controllers/CreateNews");
const GetNews_1 = require("../controllers/GetNews");
const DeleteNews_1 = require("../controllers/DeleteNews");
const UpdateNews_1 = require("../controllers/UpdateNews");
const upload_1 = require("../middleware/upload");
const basicAuth_1 = require("../middleware/basicAuth");
const router = express_1.default.Router();
// Get all news
router.get("/", GetNews_1.getNews);
// Get single news by ID
router.get("/:id", GetNews_1.getNewsById);
// Get news for editing
router.get("/edit/:id", GetNews_1.getNewsById);
// Create news - add logging middleware and fix file upload
// Make sure to use the exact field name expected by the frontend
router.post("/", basicAuth_1.basicAuth, upload_1.logRequest, upload_1.upload.array("newsImages", 10), CreateNews_1.createNews);
// Update news
router.put("/:id", basicAuth_1.basicAuth, upload_1.logRequest, upload_1.upload.array("newsImages", 10), UpdateNews_1.updateNews);
// Delete news
router.delete("/:id", basicAuth_1.basicAuth, DeleteNews_1.deleteNews);
exports.default = router;
