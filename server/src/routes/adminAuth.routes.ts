import { Router } from "express";
import { adminAuthHandler } from "../controllers/adminAuthController";

const router = Router();

router.post("/admin-auth", ...adminAuthHandler);

export default router;
