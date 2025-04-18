import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("Fetching authors from:", `${process.env.NEXT_PUBLIC_API_URL}/api/authors`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/authors`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from server:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch authors" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Authors data received:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch authors" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Log the form data for debugging
    console.log("Form data received:", {
      authorName: formData.get("authorName"),
      hasImage: formData.has("authorImage"),
      imageType:
        formData.get("authorImage") instanceof File
          ? (formData.get("authorImage") as File).type
          : "not a file",
    });

    // Check if the API URL is set
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Forward the form data to the backend server
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/create/author`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from server:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to create author" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Author created successfully:", data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating author:", error);
    return NextResponse.json(
      { error: "Failed to create author" },
      { status: 500 }
    );
  }
}
