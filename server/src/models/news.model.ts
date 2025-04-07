import { Schema, model, models, Types } from "mongoose";

export type NewsModelType = {
  title: string;
  description: string;
  category: string;
  newsImage: string; // Cloudinary-н URL
  createdAt: Date;
  updatedAt: Date;
};

const NewsSchema = new Schema<NewsModelType>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  newsImage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const NewsModel =
  models.News || model<NewsModelType>("News", NewsSchema);
