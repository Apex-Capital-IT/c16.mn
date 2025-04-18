import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Determine the API URL based on environment
    const apiUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8000" // Local development server
        : process.env.NEXT_PUBLIC_API_URL; // Production server

    if (!apiUrl) {
      console.error("API URL is not defined");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("Fetching categories from:", `${apiUrl}/api/categories`);

    const response = await fetch(`${apiUrl}/api/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from server:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch categories" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Categories data received:", data);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    console.log("Category form data:", formData);

    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("API URL is not defined");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/create/category`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to create category" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
