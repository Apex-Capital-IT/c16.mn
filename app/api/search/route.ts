import { searchArticles } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ articles: [] })
  }

  const articles = searchArticles(query)

  return NextResponse.json({ articles })
}

