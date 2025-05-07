import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  Newspaper,
  Clock,
} from "lucide-react";
import { NewsArticle } from "@/lib/axios";

const VALID_CATEGORIES = ["politics", "economy", "video", "bloggers"];

async function getAuthorByName(authorName: string) {
  try {
    const res = await fetch(
      `https://c16-mn.onrender.com/api/authors?name=${authorName}`
    );
    const data = await res.json();
    if (res.ok && Array.isArray(data.authors)) {
      return data.authors.find(
        (author: any) =>
          author.authorName.toLowerCase() === authorName.toLowerCase()
      );
    }
    return null;
  } catch {
    return null;
  }
}

async function getNewsByCategory(category: string): Promise<NewsArticle[]> {
  try {
    const response = await axios.get<{ status: string; data: NewsArticle[]; count: number }>(
      "https://c16-mn.onrender.com/api/news",
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    if (response.data.status === "success" && Array.isArray(response.data.data)) {
      return response.data.data
        .filter((article) => {
          const actualCategory = article.category.toLowerCase();
          if (VALID_CATEGORIES.includes(category.toLowerCase())) {
            return actualCategory === category.toLowerCase();
          } else {
            return !VALID_CATEGORIES.includes(actualCategory);
          }
        })
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }
    return [];
  } catch {
    return [];
  }
}

// ✅ FIX: explicit typing only for `params`
interface PageParams {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

export default async function CategoryPage({ params }: PageParams) {
  const resolvedParams = await params;
  const { category, id } = resolvedParams;

  const articles = await getNewsByCategory(category);
  const articleIndex = parseInt(id) - 1;
  const article = articles[articleIndex];

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div>
          <h1 className="text-2xl font-bold">Article not found</h1>
          <p className="text-gray-600 mt-2">
            The requested article could not be found.
          </p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 block">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const author = await getAuthorByName(article.authorName);
  const authorPostsCount = articles.filter(
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
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
                <Link
                  href={`/category/bloggers/${encodeURIComponent(
                    author.authorName
                  )}`}
                  className="flex items-center justify-center gap-3 hover:text-blue-600 transition"
                >
                  <Image
                    src={author.authorImage || "/images/default-avatar.png"}
                    alt={author.authorName}
                    width={50}
                    height={50}
                    className="rounded-full w-[50px] h-[50px] object-cover"
                  />
                  <span className="text-base font-bold text-gray-800">
                    {author.authorName}
                  </span>
                </Link>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {/* Social Media Link */}
                  {author.socialMedia && (
                    <div className="flex items-center justify-center gap-2">
                      {author.socialMedia.includes("youtube") && (
                        <a
                          href={author.socialMedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-red-500 hover:underline"
                        >
                          <YoutubeIcon size={16} />
                          <span>YouTube</span>
                        </a>
                      )}
                      {author.socialMedia.includes("facebook") && (
                        <a
                          href={author.socialMedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <FacebookIcon size={16} />
                          <span>Facebook</span>
                        </a>
                      )}
                      {author.socialMedia.includes("instagram") && (
                        <a
                          href={author.socialMedia}
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
                    Math.ceil((article.content?.split(/\s+/).length || 0) / 200)
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
                "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg"
              }
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">{article.description}</p>
            <div className="text-gray-800 whitespace-pre-line">
              {article.content}
            </div>
          </div>

          <div className="mt-12 flex justify-between items-center border-t pt-6">
            {articleIndex > 0 && (
              <Link
                href={`/${category}/${articleIndex}`}
                className="text-blue-600 hover:underline"
              >
                ← Өмнөх нийтлэл
              </Link>
            )}
            {articleIndex < articles.length - 1 && (
              <Link
                href={`/${category}/${articleIndex + 2}`}
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
