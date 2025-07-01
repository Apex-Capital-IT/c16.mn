"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GetAuthor_1 = require("../controllers/GetAuthor");
const createAuthor_1 = require("../controllers/createAuthor");
const UpdateAuthor_1 = require("../controllers/UpdateAuthor");
const DeleteAuthor_1 = require("../controllers/DeleteAuthor");
const multer_1 = __importDefault(require("multer"));
const basicAuth_1 = require("../middleware/basicAuth");
const authorRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Зөвхөн зураг файл оруулах боломжтой'));
        }
    }
});
authorRouter.get("/authors", GetAuthor_1.getAllAuthors);
authorRouter.get("/authors/:id", GetAuthor_1.getAuthorById);
authorRouter.post("/authors", basicAuth_1.basicAuth, upload.single("authorImage"), createAuthor_1.createAuthor);
authorRouter.put("/authors/:id", basicAuth_1.basicAuth, upload.single("authorImage"), UpdateAuthor_1.updateAuthor);
authorRouter.delete("/authors/:id", basicAuth_1.basicAuth, DeleteAuthor_1.deleteAuthor);
exports.default = authorRouter;
