import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, MessageSquare } from "lucide-react";
import TrendingNews from "@/components/trending-news";
import NewsCategories from "@/components/news-categories";
import EmailSubscription from "@/components/email";
import axiosInstance, { NewsArticle, fallbackNewsData } from "@/lib/axios";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getLatestNews(): Promise<NewsArticle[]> {
  try {
    const res = await axiosInstance.get<NewsArticle[]>("/api/news");
    return res.data;
  } catch (error: any) {
    console.error("Error fetching news:", error);
    // Return fallback data during build or when API is unavailable
    if (process.env.NODE_ENV === 'production' || error.code === 'ECONNREFUSED') {
      console.warn('Using fallback data for news');
      return fallbackNewsData;
    }
    return [];
  }
}

export default async function Home() {
  const news = await getLatestNews();
  const latestArticle = news[0]; // Get the most recent article

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {latestArticle && (
          <div className="mb-12">
            <Link href={`/${latestArticle.category}/1`} prefetch={false}>
              <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
                <Image
                  src={latestArticle.newsImage || "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg"}
                  alt={latestArticle.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <div className="mb-2">
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                      {latestArticle.category}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    {latestArticle.title}
                  </h1>
                  <p className="text-gray-200 mb-4 max-w-2xl">
                    {latestArticle.description}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="mr-4">
                      {new Date(
                        latestArticle.publishedDate
                      ).toLocaleDateString()}
                    </span>
                    <span>By {latestArticle.authorName}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        <EmailSubscription />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((article: NewsArticle, index: number) => (
                <div key={article._id} className="border-b pb-6">
                  <Link
                    href={`/${article.category}/${index + 1}`}
                    prefetch={false}
                  >
                    <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                      <Image
                        src={article.newsImage || "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg"}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 hover:text-red-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {article.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={14} className="mr-1" />
                      <span className="mr-4">
                        {new Date(article.publishedDate).toLocaleDateString()}
                      </span>
                      <span>By {article.authorName}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <TrendingNews />
            <div className="mt-8">
              <NewsCategories />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
