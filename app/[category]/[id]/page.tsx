import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  Newspaper,
  Clock,
} from "lucide-react";
import type { NewsArticle } from "@/lib/axios";
import {
  mockAuthors,
  mockNews,
  getNewsById,
  getNewsByCategory,
} from "@/lib/mock-data";

function getAuthorByName(authorName: string) {
  return (
    mockAuthors.find(
      (a) => a.authorName.toLowerCase() === authorName.toLowerCase()
    ) || null
  );
}

function getCategoryArticles(category: string): NewsArticle[] {
  return [...getNewsByCategory(category)].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function generateStaticParams() {
  return mockNews.map((n) => ({ category: n.category, id: n._id }));
}

// ✅ FIX: explicit typing only for `params`
interface PageParams {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { id } = await params;
  const article = getNewsById(id);
  if (!article) return { title: "Мэдээ олдсонгүй" };
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.newsImages?.slice(0, 1),
    },
  };
}

export default async function ArticlePage({ params }: PageParams) {
  const resolvedParams = await params;
  const { category, id } = resolvedParams;

  const article = getNewsById(id);
  if (!article || article.category !== category) {
    notFound();
  }

  const articles = getCategoryArticles(category);
  const articleIndex = articles.findIndex((a) => a._id === article._id);

  const author = getAuthorByName(article.authorName);
  const socialMedia = (author as { socialMedia?: string } | null)
    ?.socialMedia;
  const authorPostsCount = mockNews.filter(
    (a) =>
      a.authorName?.trim().toLowerCase() ===
      article.authorName.trim().toLowerCase()
  ).length;

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="md:w-1/4 border-r border-gray-200 pr-6 hidden md:block">
          <div className="sticky top-20 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Нийтлэлч
            </h2>
            {author ? (
              <div className="bg-gray-50 rounded-xl shadow-sm border">
                <Link
                  href="/bloggers"
                  className="flex flex-col items-center justify-center gap-3 hover:text-blue-600 transition"
                >
                  <Image
                    src={author.authorImage || "/images/default-avatar.png"}
                    alt={author.authorName}
                    width={260}
                    height={260}
                    className="w-[310px] h-[300px] object-cover"
                  />
                  <span className="text-base font-bold text-gray-800 mt-2">
                    {author.authorName}
                  </span>
                </Link>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {/* Social Media Link */}
                  {socialMedia && (
                    <div className="flex items-center justify-center gap-2">
                      {socialMedia.includes("youtube") && (
                        <a
                          href={socialMedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-red-500 hover:underline"
                        >
                          <YoutubeIcon size={16} />
                          <span>YouTube</span>
                        </a>
                      )}
                      {socialMedia.includes("facebook") && (
                        <a
                          href={socialMedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <FacebookIcon size={16} />
                          <span>Facebook</span>
                        </a>
                      )}
                      {socialMedia.includes("instagram") && (
                        <a
                          href={socialMedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-pink-500 hover:underline"
                        >
                          <InstagramIcon size={16} />
                          <span>Instagram</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Post Count */}
                  <div className="flex items-center justify-center gap-2 text-gray-700 border-t pt-2 mt-4">
                    <Newspaper size={16} />
                    <span>{authorPostsCount} нийтлэл</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Зохиолчийн мэдээлэл олдсонгүй.
              </p>
            )}
          </div>
        </aside>

        {/* Main Article Section */}
        <section className="md:w-3/4">
          <div className="mb-8">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:underline mb-2 inline-block"
            >
              « Өмнөх
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-4">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <span>By {article.authorName}</span>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>
                  {Math.max(
                    1,
                    Math.ceil((article.content?.replace(/<[^>]+>/g, " ").split(/\s+/).length || 0) / 200)
                  )}{" "}
                  мин унших
                </span>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] w-full mb-8 overflow-hidden rounded-lg">
            <Image
              src={
                article.newsImages?.[0] ||
                "https://picsum.photos/seed/c16-fallback/1200/675"
              }
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">{article.description}</p>
            <div
              className="text-gray-800 space-y-4"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          <div className="mt-12 flex justify-between items-center border-t pt-6">
            {articleIndex > 0 && (
              <Link
                href={`/${category}/${articles[articleIndex - 1]?._id}`}
                className="text-blue-600 hover:underline"
              >
                ← Өмнөх нийтлэл
              </Link>
            )}
            {articleIndex < articles.length - 1 && (
              <Link
                href={`/${category}/${articles[articleIndex + 1]?._id}`}
                className="text-blue-600 hover:underline ml-auto"
              >
                Дараагийн нийтлэл →
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
