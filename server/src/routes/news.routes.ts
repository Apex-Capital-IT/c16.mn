import express, { RequestHandler } from "express";
import { createNews } from "../controllers/CreateNews";
import { getNews, getNewsById } from "../controllers/GetNews";
import { deleteNews } from "../controllers/DeleteNews";
import { updateNews } from "../controllers/UpdateNews";
import { upload, logRequest } from "../middleware/upload";
import { basicAuth } from "../middleware/basicAuth";

const router = express.Router();

router.get("/", getNews as RequestHandler);

router.get("/:id", getNewsById as RequestHandler);

router.get("/edit/:id", getNewsById as RequestHandler);

router.post("/", basicAuth, logRequest, upload.array("newsImages", 10), createNews as RequestHandler);

router.put("/:id", basicAuth, logRequest, upload.array("newsImages", 10), updateNews as RequestHandler);

router.delete("/:id", basicAuth, deleteNews as RequestHandler);

export default router;
