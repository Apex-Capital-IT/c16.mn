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

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const newArticle = new NewsModel(body);
    await newArticle.save();

    return NextResponse.json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const query = category ? { category } : {};
    const articles = await NewsModel.find(query).sort({ createdAt: -1 });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
} 