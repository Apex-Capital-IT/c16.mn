import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import blogRoutes from "./routes/blog.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(express.json());
app.use(cors());

// ✅ Блогийн маршрут холбох
app.use("/api/blogs", blogRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(err));
