import Link from "next/link";
import { Eye, MessageSquare } from "lucide-react";
import { getArticles } from "@/lib/db";

export default function TrendingNews() {
  // Sort articles by views to get trending articles
  const trendingArticles = getArticles()
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div className="trending-news bg-gray-50 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Top Stories</h2>

      <div className="space-y-6">
        {trendingArticles.map((article) => (
          <div key={article.id} className="border-l-4 border-black pl-4 py-1">
            <div className="font-semibold text-black mb-1">
              {article.category}
            </div>
            <Link href={`/article/${article.slug}`} className="block">
              <h3 className="font-medium hover:text-red-600 transition-colors mb-2">
                {article.title}
              </h3>
            </Link>
            <div className="flex items-center text-xs text-gray-500">
              <Eye size={14} className="mr-1" />
              <span className="mr-4">{article.views}</span>

              <span>{article.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
