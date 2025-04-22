import Link from "next/link";
import { Eye } from "lucide-react";
import axiosInstance, { NewsArticle, fallbackNewsData } from "@/lib/axios";

async function getTrendingNews(): Promise<NewsArticle[]> {
  try {
    const res = await axiosInstance.get<NewsArticle[]>("/api/news");
    return res.data;
  } catch (error: any) {
    console.error("Error fetching trending news:", error);
    // Return fallback data during build or when API is unavailable
    if (
      process.env.NODE_ENV === "production" ||
      error.code === "ECONNREFUSED"
    ) {
      console.warn("Using fallback data for trending news");
      return fallbackNewsData;
    }
    return [];
  }
}

export default async function TrendingNews() {
  const news = await getTrendingNews();

  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-bold mb-6">Latest News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((article: NewsArticle) => (
          <div key={article._id} className="border-b pb-6">
            <Link
              href={`/${article.category}/${article._id}`}
              prefetch={false}
            >
              <h3 className="font-semibold text-lg mb-2 hover:text-red-600 transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center text-xs text-gray-500">
                <Eye size={14} className="mr-1" />
                <span>By {article.authorName}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
