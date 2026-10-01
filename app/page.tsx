import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, MessageSquare } from "lucide-react";
import TrendingNews from "@/components/trending-news";
import EmailSubscription from "@/components/email";
import type { NewsArticle } from "@/lib/axios";
import { mockNews, mockCategories } from "@/lib/mock-data";

function getLatestNews(): NewsArticle[] {
  return [...mockNews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

const categoryLabel = (slug: string) =>
  mockCategories.find((c) => c.slug === slug)?.categoryName || slug;

export default function Home() {
  const news = getLatestNews();

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

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {latestBannerArticle && (
          <div className="mb-12">
            <Link
              href={`/${categoryLabel(latestBannerArticle.category)}/${latestBannerArticle._id}`}
              prefetch={false}
            >
              <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
                <Image
                  src={
                    latestBannerArticle.newsImages?.[0] ||
                    "https://picsum.photos/seed/c16-fallback/1200/675"
                  }
                  alt={latestBannerArticle.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <div className="mb-2">
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                      {categoryLabel(latestBannerArticle.category)}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3 uppercase">
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
                    href={`/${article.category}/${article._id}`}
                    prefetch={false}
                  >
                    <div className="relative h-40 mb-4 overflow-hidden rounded-md">
                      <Image
                        src={
                          article.newsImages?.[0] ||
                          "https://picsum.photos/seed/c16-fallback/1200/675"
                        }
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-semibold h-[55px] overflow-hidden text-lg mb-2 hover:text-red-600 uppercase transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 h-fit max-h-[40px] overflow-hidden text-sm mb-4">
                      {article.description}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Popular news</h2>
            <div className="flex flex-col justify-center gap-6">
              {[...allArticles].sort((a, b) => b.views - a.views).slice(0, 6).map((article: NewsArticle) => (
                <div key={article._id} className="border-b pb-6">
                  <Link
                    href={`/${article.category}/${article._id}`}
                    prefetch={false}
                  >
                    <div className="relative h-40 mb-4 overflow-hidden rounded-md">
                      <Image
                        src={
                          article.newsImages?.[0] ||
                          "https://picsum.photos/seed/c16-fallback/1200/675"
                        }
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-semibold h-[55px] overflow-hidden text-lg mb-2 hover:text-red-600 transition-colors uppercase">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 h-fit max-h-[100px] overflow-hidden text-sm mb-4">
                      {article.description}
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
