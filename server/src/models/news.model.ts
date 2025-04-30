import { Schema, model } from "mongoose";

const newsSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    newsImages: [{ type: String }],
    authorName: { type: String, required: true },
    authorImage: { type: String },
    banner: { type: Boolean, default: false },
    slug: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export const NewsModel = model("News", newsSchema);
