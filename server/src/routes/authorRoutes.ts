import express from "express";
import { getAllAuthors, getAuthorById } from "../controllers/GetAuthor";
import { createAuthor } from "../controllers/createAuthor";
import { updateAuthor } from "../controllers/UpdateAuthor";
import { deleteAuthor } from "../controllers/DeleteAuthor";
import multer from "multer";
import { basicAuth } from "../middleware/basicAuth";

const authorRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Зөвхөн зураг файл оруулах боломжтой'));
    }
  }
});

authorRouter.get("/authors", getAllAuthors);

authorRouter.get("/authors/:id", getAuthorById);

authorRouter.post("/authors", basicAuth, upload.single("authorImage"), createAuthor);

authorRouter.put("/authors/:id", basicAuth, upload.single("authorImage"), updateAuthor);

authorRouter.delete("/authors/:id", basicAuth, deleteAuthor);

export default authorRouter;
