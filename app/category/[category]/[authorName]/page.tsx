import Image from "next/image";
import Link from "next/link";
import { Clock, InstagramIcon, FacebookIcon, YoutubeIcon } from "lucide-react";
import axios from "axios";
import { NewsArticle } from "@/lib/axios";

// Fetch articles by author
async function getArticlesByAuthor(authorId: string): Promise<NewsArticle[]> {
  try {
    const res = await axios.get<{
      status: string;
      data: NewsArticle[];
      count: number;
    }>("https://c16-mn.onrender.com/api/news", {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (res.data.status === "success" && Array.isArray(res.data.data)) {
      return res.data.data
        .filter(
          (article: NewsArticle) =>
            article.authorId === authorId
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    return [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

// Fetch all articles for a category
async function getArticlesByCategory(category: string): Promise<NewsArticle[]> {
  try {
    const res = await axios.get<{
      status: string;
      data: NewsArticle[];
      count: number;
    }>("https://c16-mn.onrender.com/api/news", {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (res.data.status === "success" && Array.isArray(res.data.data)) {
      const normalizedCat = normalizeCategory(category);
      return res.data.data
        .filter(
          (article: NewsArticle) =>
            normalizeCategory(article.category) === normalizedCat
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    return [];
  } catch (error) {
    console.error("Error fetching category articles:", error);
    return [];
  }
}

// Fetch all articles
async function getAllArticles(): Promise<NewsArticle[]> {
  try {
    const res = await axios.get<{
      status: string;
      data: NewsArticle[];
      count: number;
    }>("https://c16-mn.onrender.com/api/news", {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (res.data.status === "success" && Array.isArray(res.data.data)) {
      return res.data.data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return [];
  } catch (error) {
    console.error("Error fetching all articles:", error);
    return [];
  }
}

// Normalize category names for URLs
function normalizeCategory(category: string): string {
  const categoryLower = category.toLowerCase();
  if (categoryLower === "бусад") return "other";
  if (
    ["politics", "economy", "video", "bloggers", "other"].includes(
      categoryLower
    )
  ) {
    return categoryLower;
  }
  return category;
}

// Fetch all articles directly from the API
async function getAllCategoryArticles(
  categoryName: string
): Promise<NewsArticle[]> {
  try {
    // Direct API call to get fresh data
    const res = await axios.get<{
      status: string;
      data: NewsArticle[];
      count: number;
    }>("https://c16-mn.onrender.com/api/news", {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (res.data.status === "success" && Array.isArray(res.data.data)) {
      const normalizedRequestedCategory = normalizeCategory(categoryName);

      // Filter articles by normalized category and sort by date (newest first)
      return res.data.data
        .filter(
          (article) =>
            normalizeCategory(article.category) === normalizedRequestedCategory
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return [];
  } catch (error) {
    console.error("Error fetching category articles:", error);
    return [];
  }
}

// Get index of article in its category
async function getCategoryPositionForArticle(
  article: NewsArticle
): Promise<number> {
  try {
    // Get all articles in this article's category, freshly from the API
    const categoryArticles = await getAllCategoryArticles(article.category);

    // Debug info
    console.log(
      `Found ${
        categoryArticles.length
      } articles in category ${normalizeCategory(article.category)}`
    );

    if (categoryArticles.length > 0) {
      // Find the index of our article in the category-specific list (which is already sorted by newest first)
      const position = categoryArticles.findIndex((a) => a._id === article._id);

      // Since articles are sorted newest first, index 0 is the newest article
      // Convert to position where newest = total count, oldest = 1
      if (position >= 0) {
        // Calculate position: (total count) - (zero-based index)
        const actualPosition = categoryArticles.length - position;
        console.log(
          `Article ${article._id} found at index ${position}, calculated position: ${actualPosition}`
        );
        return actualPosition;
      }
    }

    // Default to 1 if not found
    return 1;
  } catch (error) {
    console.error("Error determining article position:", error);
    return 1;
  }
}

// Fetch author info
async function getAuthorInfo(authorId: string) {
  try {
    const res = await axios.get<{ authors: any[] }>(
      "https://c16-mn.onrender.com/api/authors",
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );
    return res.data.authors.find(
      (author: any) => author._id === authorId
    );
  } catch {
    return null;
  }
}

interface PageParams {
  params: Promise<{
    category: string;
    authorName: string;
  }>;
}

export default async function AuthorPage({ params }: PageParams) {
  const resolvedParams = await params;
  const { category, authorName } = resolvedParams;

  // Fetch the author's articles using ID
  const articles = await getArticlesByAuthor(authorName);
  const author = await getAuthorInfo(authorName);

  // For each article, determine its category position
  const articlePositions = await Promise.all(
    articles.map(async (article) => {
      const position = await getCategoryPositionForArticle(article);
      return { article, position };
    })
  );

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Author Profile Card */}
          <div className="md:w-1/4">
            <div className="sticky top-20">
              {author ? (
                <div className="rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Image
                        src={author.authorImage || "/images/default-avatar.png"}
                        alt={author.authorName}
                        width={120}
                        height={120}
                        className="rounded-full w-[120px] h-[120px] object-cover border shadow-md"
                      />
                      <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                          {author.authorName}
                        </h2>
                        {author.socialMedia ? (
                          <a
                            href={author.socialMedia}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 text-sm font-medium hover:underline">
                            {author.socialMedia.includes("instagram") && (
                              <>
                                <InstagramIcon className="w-4 h-4 mr-1" />
                                Instagram
                              </>
                            )}
                            {author.socialMedia.includes("facebook") && (
                              <>
                                <FacebookIcon className="w-4 h-4 mr-1" />
                                Facebook
                              </>
                            )}
                            {author.socialMedia.includes("youtube") && (
                              <>
                                <YoutubeIcon className="w-4 h-4 mr-1" />
                                YouTube
                              </>
                            )}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-500">Холбоос байхгүй</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-[120px] h-[120px] bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                          Зохиолч олдсонгүй
                        </h2>
                        <p className="text-sm text-gray-500">ID: {authorName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="md:w-3/4">
            <h1 className="text-4xl font-bold text-gray-800 mb-10">
              {author ? author.authorName : "Зохиолч"} - нийтлэлүүд
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articlePositions.map(({ article, position }) => (
                <div
                  key={article._id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link
                    href={`/${normalizeCategory(article.category)}/${position}`}
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
                        <span>
                          {new Date(article.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
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
