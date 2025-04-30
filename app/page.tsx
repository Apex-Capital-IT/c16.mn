import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, MessageSquare } from "lucide-react";
import TrendingNews from "@/components/trending-news";
import EmailSubscription from "@/components/email";
import axios from "axios";
import { NewsArticle } from "@/lib/axios";

// Disable caching for this page
export const revalidate = 0;

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getLatestNews(): Promise<NewsArticle[]> {
  try {
    const response = await axios.get<NewsArticle[]>(
      "https://c16-mn.onrender.com/api/news",
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );
    return (response.data || []).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export default async function Home() {
  const news = await getLatestNews();

  if (!news || news.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">No articles found</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </main>
    );
  }

  const allArticles = news;
  const bannerArticles = news.filter((article) => article.banner);
  const latestBannerArticle = bannerArticles[0];

  const getArticleIndex = (article: NewsArticle) => {
    if (!article) return 1;
    const categoryArticles = news
      .filter(
        (a) => a.category.toLowerCase() === article.category.toLowerCase()
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    return categoryArticles.findIndex((a) => a._id === article._id) + 1;
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {latestBannerArticle && (
          <div className="mb-12">
            <Link
              href={`/${latestBannerArticle.category}/${getArticleIndex(
                latestBannerArticle
              )}`}
              prefetch={false}
            >
              <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
                <Image
                  src={
                    latestBannerArticle.newsImages?.[0] ||
                    "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg"
                  }
                  alt={latestBannerArticle.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <div className="mb-2">
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                      {latestBannerArticle.category}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    {latestBannerArticle.title}
                  </h1>
                  <p className="text-gray-200 mb-4 max-w-2xl">
                    {latestBannerArticle.description}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="mr-4">
                      {new Date(latestBannerArticle.createdAt).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }
                      )}
                    </span>
                    <span>By {latestBannerArticle.authorName}</span>
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
            <div className="grid grid-cols-2 justify-center gap-6">
              {allArticles.map((article: NewsArticle) => (
                <div key={article._id} className="border-b pb-6">
                  <Link
                    href={`/${article.category}/${getArticleIndex(article)}`}
                    prefetch={false}
                  >
                    <div className="relative h-40 mb-4 overflow-hidden rounded-md">
                      <Image
                        src={
                          article.newsImages?.[0] ||
                          "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg"
                        }
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 hover:text-red-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {article.content}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Popular news</h2>
            <div className="flex flex-col justify-center gap-6">
              {allArticles.map((article: NewsArticle) => (
                <div key={article._id} className="border-b pb-6">
                  <Link
                    href={`/${article.category}/${getArticleIndex(article)}`}
                    prefetch={false}
                  >
                    <div className="relative h-40 mb-4 overflow-hidden rounded-md">
                      <Image
                        src={
                          article.newsImages?.[0] ||
                          "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg"
                        }
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 hover:text-red-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {article.content}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
