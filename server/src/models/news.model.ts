import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  newsImage: { type: String },
  authorName: { type: String },
  authorImage: { type: String },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

export const NewsModel = mongoose.model("News", newsSchema);
