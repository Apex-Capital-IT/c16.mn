import Link from "next/link";
import { Eye } from "lucide-react";
import axiosInstance, { NewsArticle } from "@/lib/axios";

async function getTrendingNews(): Promise<NewsArticle[]> {
  try {
    const res = await axiosInstance.get<NewsArticle[]>('/api/news');
    return res.data;
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return [];
  }
}

export default async function TrendingNews() {
  const news = await getTrendingNews();

  return (
    <div className="trending-news bg-gray-50 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Top Stories</h2>

      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {news.map((article: any) => (
          <div key={article._id} className="border-l-4 border-black pl-4 py-1 hover:bg-white transition-colors">
            <div className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 bg-red-100 text-red-800">
              {article.category}
            </div>
            <h3 className="font-medium hover:text-red-600 transition-colors mb-2">
              {article.title}
            </h3>
            <div className="flex items-center text-xs text-gray-500">
              <Eye size={14} className="mr-1" />
              <span>{article.authorName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
