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

export async function GET() {
  try {
    await connectDB();
    
    const featuredArticles = await NewsModel.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(1);

    return NextResponse.json(featuredArticles[0] || null);
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured articles" },
      { status: 500 }
    );
  }
} 