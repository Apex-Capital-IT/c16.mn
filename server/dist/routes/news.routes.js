"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CreateNews_1 = require("../controllers/CreateNews");
const GetNews_1 = require("../controllers/GetNews");
const DeleteNews_1 = require("../controllers/DeleteNews");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.route("/create/news").post(upload_1.upload.fields([
    { name: 'newsImages', maxCount: 10 }
]), CreateNews_1.createNews);
router.get("/news", GetNews_1.getNews);
router.delete("/news/:id", DeleteNews_1.deleteNews);
exports.default = router;
