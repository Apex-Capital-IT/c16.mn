import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, MessageSquare } from "lucide-react";
import { getFeaturedArticles, getArticles } from "@/lib/db";
import TrendingNews from "@/components/trending-news";
import NewsCategories from "@/components/news-categories";
import EmailSubscription from "@/components/email";

export default function Home() {
  const featuredArticle = getFeaturedArticles()[0];
  const latestArticles = getArticles().slice(0, 6);

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {featuredArticle && (
          <div className="mb-12">
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
              <Image
                src="/medeenii_cover1.jpg"
                alt={featuredArticle.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="mb-2">
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                    {featuredArticle.category}
                  </span>
                </div>
                <Link href={`/article/${featuredArticle.slug}`}>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3 hover:text-red-600 transition-colors">
                    {featuredArticle.title}
                  </h1>
                </Link>
                <p className="text-gray-200 mb-4 max-w-2xl">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center text-sm">
                  <span className="mr-4">{featuredArticle.date}</span>
                  <span>By {featuredArticle.author}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <EmailSubscription />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestArticles.map((article) => (
                <div key={article.id} className="border-b pb-6">
                  <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                    <Image
                      src="/medeenii_cover1.jpg"
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Link href={`/article/${article.slug}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-red-600 transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span className="mr-4">{article.date}</span>
                    <Eye size={14} className="mr-1" />
                    <span className="mr-4">{article.views}</span>
                  </div>
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
