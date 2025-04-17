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
    throw error;
  }
};

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    
    let query = {};
    if (category) {
      query = { category };
    }
    
    const articles = await NewsModel.find(query)
      .sort({ createdAt: -1 })
      .limit(10);
      
    return NextResponse.json(articles, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    
    // Log form data for debugging
    console.log("Received form data:", {
      title: formData.get("title"),
      content: formData.get("content"),
      category: formData.get("category"),
      authorName: formData.get("authorName"),
      banner: formData.get("banner"),
      newsImages: formData.getAll("newsImages"),
    });
    
    // Validate required fields
    const requiredFields = ['title', 'content', 'category', 'authorName'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    const article = {
      title: formData.get("title"),
      content: formData.get("content"),
      category: formData.get("category"),
      authorName: formData.get("authorName"),
      banner: formData.get("banner") === "true",
      newsImages: formData.getAll("newsImages"),
    };
    
    console.log("Creating article with data:", article);
    
    const newArticle = await NewsModel.create(article);
    return NextResponse.json(newArticle);
  } catch (error: any) {
    console.error("Error creating article:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
