import { NextResponse } from "next/server";
import mongoose from "mongoose";

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
    // Get the form data from the request
    const formData = await request.formData();
    
    // Log the form data for debugging
    console.log("Form data received:", {
      title: formData.get("title"),
      content: formData.get("content"),
      category: formData.get("category"),
      authorName: formData.get("authorName"),
      banner: formData.get("banner"),
      hasNewsImages: formData.getAll("newsImages").length > 0,
    });
    
    // Forward the form data to the backend
    console.log("Sending request to:", `${process.env.NEXT_PUBLIC_API_URL}/api/create/news`);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create/news`, {
      method: "POST",
      body: formData, // Forward the FormData directly
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from backend:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to create article" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Success response from backend:", data);
    return NextResponse.json(data);
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
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/news${category ? `?category=${category}` : ""}`,
      {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch articles" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
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
