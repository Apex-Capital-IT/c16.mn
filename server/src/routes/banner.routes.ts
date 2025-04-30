import express from "express";
import {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController";
import multer from "multer";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), createBanner);
router.get("/", getBanners);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);

export default router;
