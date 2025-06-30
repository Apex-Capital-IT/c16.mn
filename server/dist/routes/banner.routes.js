"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bannerController_1 = require("../controllers/bannerController");
const multer_1 = __importDefault(require("multer"));
const basicAuth_1 = require("../middleware/basicAuth");
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.post("/", basicAuth_1.basicAuth, upload.single("file"), bannerController_1.createBanner);
router.get("/", bannerController_1.getBanners);
router.put("/:id", basicAuth_1.basicAuth, bannerController_1.updateBanner);
router.delete("/:id", basicAuth_1.basicAuth, bannerController_1.deleteBanner);
exports.default = router;
