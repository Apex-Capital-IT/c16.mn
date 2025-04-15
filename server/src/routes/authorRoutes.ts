import { Router } from "express";
import { createAuthor } from "../controllers/createAuthor";
import { upload } from "../middleware/upload";
import { getAllAuthors } from "../controllers/GetAuthor";

const authorRouter = Router();

authorRouter.post("/create/author", upload.single("authorImage"), createAuthor);
authorRouter.get("/authors", getAllAuthors);

export default authorRouter;
