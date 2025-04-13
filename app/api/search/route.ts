import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { NewsModel } from "@/app/models/news.model";

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    if (!query) {
      return NextResponse.json([]);
    }

    // Create a case-insensitive regex for the search query
    const searchRegex = new RegExp(query, 'i');

    // Search in title, description, and category
    const articles = await NewsModel.find({
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } }
      ]
    }).sort({ publishedDate: -1 });

    // Transform the articles to include the slug
    const articlesWithSlug = articles.map(article => ({
      ...article.toObject(),
      slug: article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }));

    return NextResponse.json(articlesWithSlug);
  } catch (error) {
    console.error("Error searching articles:", error);
    return NextResponse.json(
      { error: "Failed to search articles" },
      { status: 500 }
    );
  }
}

