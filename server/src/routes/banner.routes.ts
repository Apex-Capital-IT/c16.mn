import express from "express";
import {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController";
import multer from "multer";
import { basicAuth } from "../middleware/basicAuth";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", basicAuth, upload.single("file"), createBanner);
router.get("/", getBanners);
router.put("/:id", basicAuth, updateBanner);
router.delete("/:id", basicAuth, deleteBanner);

export default router;
