import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { NewsModel } from "@/app/models/news.model";

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
    console.log("MONGO_URI:", process.env.MONGO_URI);
    
    const count = await NewsModel.countDocuments();
    console.log("Total articles in database:", count);
    
    const articles = await NewsModel.find().sort({ createdAt: -1 }).limit(5);
    console.log("Sample articles:", articles);
    
    return NextResponse.json({
      totalArticles: count,
      sampleArticles: articles,
      mongoUri: process.env.MONGO_URI
    });
  } catch (error) {
    console.error("Test route error:", error);
    return NextResponse.json(
      { error: "Test route failed", details: error },
      { status: 500 }
    );
  }
} 