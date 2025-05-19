import express from "express";
import { getAllAuthors, getAuthorById } from "../controllers/GetAuthor";
import { createAuthor } from "../controllers/createAuthor";
import { updateAuthor } from "../controllers/UpdateAuthor";
import { deleteAuthor } from "../controllers/DeleteAuthor";
import multer from "multer";

const authorRouter = express.Router();

// Configure multer for author image uploads using memory storage for Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Зөвхөн зураг файл оруулах боломжтой'));
    }
  }
});

// Get all authors with pagination
authorRouter.get("/authors", getAllAuthors);

// Get author by ID
authorRouter.get("/authors/:id", getAuthorById);

// Create new author
authorRouter.post("/authors", upload.single("authorImage"), createAuthor);

// Update author
authorRouter.put("/authors/:id", upload.single("authorImage"), updateAuthor);

// Delete author
authorRouter.delete("/authors/:id", deleteAuthor);

export default authorRouter;
