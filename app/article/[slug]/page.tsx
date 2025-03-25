import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Eye,
  MessageSquare,
  Share2,
  Facebook,
  Twitter,
} from "lucide-react";
import { getArticleBySlug, getArticles } from "@/lib/db";
import TrendingNews from "@/components/trending-news";
import EmailSubscription from "@/components/email";

// Mark the component as async to handle dynamic params
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await the params to resolve the slug
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  // Get related articles from the same category
  const relatedArticles = article
    ? (await getArticles())
        .filter(
          (a) => a.categorySlug === article.categorySlug && a.id !== article.id
        )
        .slice(0, 3)
    : [];

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <p>The article you are looking for does not exist.</p>
        <Link
          href="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Return to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <article className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <Link
                href={`/category/${article.categorySlug}`}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                {article.category}
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {article.title}
            </h1>

            <div className="flex items-center text-sm text-gray-600 mb-6">
              <span className="mr-4">By {article.author}</span>
              <Clock size={16} className="mr-1" />
              <span className="mr-4">{article.date}</span>
              <Eye size={16} className="mr-1" />
              <span className="mr-4">{article.views}</span>

              <span>{article.comments}</span>
            </div>

            <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src="/medeenii_cover1.jpg"
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex justify-between items-center mb-8">
              <div className="text-sm text-gray-600">Share this article:</div>
              <div className="flex space-x-2">
                <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Facebook size={16} />
                </button>
                <button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                  <Twitter size={16} />
                </button>
                <button className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <div
              className="prose max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {relatedArticles.length > 0 && (
              <div className="border-t pt-8">
                <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      href={`/article/${relatedArticle.slug}`}
                      className="block hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    >
                      <h4 className="font-medium hover:text-red-600 transition-colors">
                        {relatedArticle.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        <div className="lg:col-span-1">
          <TrendingNews />
        </div>
      </div>
      <EmailSubscription />
    </div>
  );
}
