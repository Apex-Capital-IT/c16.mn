import Link from "next/link";
import { Eye, MessageSquare } from "lucide-react";
import { getArticles } from "@/lib/db";

export default function TrendingNews() {
  // Sort articles by views to get trending articles
  const trendingArticles = getArticles().sort((a, b) => b.views - a.views);

  return (
    <div className="trending-news bg-gray-50 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Top Stories</h2>

      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {trendingArticles.map((article) => (
          <div key={article.id} className="border-l-4 border-black pl-4 py-1 hover:bg-white transition-colors">
            <div className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2
              ${article.categorySlug === "politics" ? "bg-blue-100 text-blue-800" : ""}
              ${article.categorySlug === "economy" ? "bg-green-100 text-green-800" : ""}
              ${article.categorySlug === "other" ? "bg-orange-100 text-orange-800" : ""}
              ${article.categorySlug === "bloggers" ? "bg-indigo-100 text-indigo-800" : ""}
              ${article.categorySlug === "video" ? "bg-pink-100 text-pink-800" : ""}
              ${article.categorySlug === "sports" ? "bg-purple-100 text-purple-800" : ""}
              ${article.categorySlug === "research" ? "bg-red-100 text-red-800" : ""}
            `}>
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
              <span className="text-gray-400">{article.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
