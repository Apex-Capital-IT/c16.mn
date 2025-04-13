import { Schema, model, models } from "mongoose";

export interface NewsArticle {
  title: string;
  description: string;
  category: string;
  newsImage: string;
  youtubeUrl?: string;
  authorName: string;
  authorImage: string;
  publishedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<NewsArticle>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    newsImage: { type: String, required: true },
    youtubeUrl: { type: String },
    authorName: { type: String, required: true },
    authorImage: { type: String, required: true },
    publishedDate: { type: Date, required: true }
  },
  {
    timestamps: true
  }
);

export const NewsModel = models.News || model<NewsArticle>("News", NewsSchema); 