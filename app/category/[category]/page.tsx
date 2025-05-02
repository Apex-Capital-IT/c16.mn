// ene category oor orj bga medeelel
import Image from "next/image";
import Link from "next/link";
import { Clock, FacebookIcon, YoutubeIcon, InstagramIcon } from "lucide-react";
import axios from "axios";
import { NewsArticle } from "@/lib/axios";

// Fetch articles by category
async function getNewsByCategory(category: string): Promise<NewsArticle[]> {
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
    return response.data
      .map((article) => ({
        ...article,
        normalizedCategory: [
          "politics",
          "economy",
          "video",
          "bloggers",
        ].includes(article.category.toLowerCase())
          ? article.category.toLowerCase()
          : "other",
      }))
      .filter(
        (article) =>
          article.normalizedCategory.toLowerCase() === category.toLowerCase()
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  } catch (error) {
    return [];
  }
}

// Fetch all authors with article stats
async function getAllAuthorsWithStats() {
  try {
    const [authorRes, articleRes] = await Promise.all([
      axios.get<{ authors: any[] }>("https://c16-mn.onrender.com/api/authors"),
      axios.get<NewsArticle[]>("https://c16-mn.onrender.com/api/news"),
    ]);

    const authors = authorRes.data.authors || [];
    const articles = articleRes.data || [];

    return authors.map((author: any) => {
      const authorArticles = articles.filter(
        (a: any) =>
          a.authorName.toLowerCase() === author.authorName.toLowerCase()
      );
      const latestPost = authorArticles.length
        ? new Date(
            authorArticles.reduce((latest: any, curr: any) =>
              new Date(curr.createdAt) > new Date(latest.createdAt)
                ? curr
                : latest
            ).createdAt
          ).toLocaleDateString("mn-MN")
        : "—";
      return {
        ...author,
        postCount: authorArticles.length,
        latestPost,
      };
    });
  } catch {
    return [];
  }
}

// Get all articles by author
async function getArticlesByAuthor(authorName: string): Promise<NewsArticle[]> {
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
    return response.data.filter(
      (article: NewsArticle) =>
        article.authorName.toLowerCase() === authorName.toLowerCase()
    );
  } catch {
    return [];
  }
}

// Get article index (for linking)
function getArticleIndex(
  articles: NewsArticle[],
  article: NewsArticle
): number {
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return sortedArticles.findIndex((a) => a._id === article._id) + 1;
}

// Route component
export default async function CategoryPage({ params }: any) {
  const { category, authorName } = params as {
    category: string;
    authorName?: string;
  };

  const VALID_CATEGORIES = ["politics", "economy", "video", "bloggers"];
  const resolvedCategory = VALID_CATEGORIES.includes(category.toLowerCase())
    ? category.toLowerCase()
    : "other";

  if (resolvedCategory === "bloggers" && authorName) {
    const articles = await getArticlesByAuthor(authorName);

    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">{authorName} - нийтлэлүүд</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: NewsArticle) => (
              <div
                key={article._id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/${resolvedCategory}/${getArticleIndex(
                    articles,
                    article
                  )}`}
                  prefetch={false}
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={article.newsImages?.[0] || "/images/placeholder.jpg"}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-1">
                      {article.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {article.description}
                    </p>
                    <div className="text-xs text-gray-500 mt-2 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (resolvedCategory === "bloggers") {
    const authors = await getAllAuthorsWithStats();

    return (
      <main className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
            Зохиолчид
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {authors.map((author: any) => (
              <Link
                key={author._id}
                href={`/category/bloggers/${encodeURIComponent(
                  author.authorName
                )}`}
                className="group block transition-transform hover:scale-[1.02]"
              >
                <div className="rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Image
                        src={author.authorImage || "/images/default-avatar.png"}
                        alt={author.authorName}
                        width={56}
                        height={56}
                        className="rounded-full w-[56px] h-[56px] object-cover border shadow-md"
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {author.authorName}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {author.postCount || 0} нийтлэл • Сүүлд:{" "}
                          <span className="text-gray-700 font-medium">
                            {author.latestPost || "—"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  const articles = await getNewsByCategory(resolvedCategory);

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">
            No articles found in {resolvedCategory}
          </h1>
          <Link
            href="/"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 capitalize">
          {resolvedCategory === "other"
            ? "Other News"
            : `${resolvedCategory} News`}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: NewsArticle) => (
            <div
              key={article._id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                href={`/${resolvedCategory}/${getArticleIndex(
                  articles,
                  article
                )}`}
                prefetch={false}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={article.newsImages?.[0] || "/images/placeholder.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-xl uppercase h-[50px] overflow-hidden font-semibold mb-2 hover:text-red-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span className="mr-4">
                      {new Date(article.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span>By {article.authorName}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
