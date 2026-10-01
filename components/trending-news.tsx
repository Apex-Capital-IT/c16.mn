import Link from "next/link";
import { Eye } from "lucide-react";
import type { NewsArticle } from "@/lib/axios";
import { mockNews } from "@/lib/mock-data";

function getTrendingNews(): NewsArticle[] {
  return [...mockNews].sort((a, b) => b.views - a.views).slice(0, 6);
}

export default function TrendingNews() {
  const news = getTrendingNews();

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
