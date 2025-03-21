import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface Article {
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  slug: string;
}

interface CategorySectionProps {
  title: string;
  viewAllLink: string;
  articles: Article[];
}

export default function CategorySection({
  title,
  viewAllLink,
  articles,
}: CategorySectionProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link
          href={viewAllLink}
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
        >
          View All <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-4 pb-6 border-b border-gray-200"
          >
            <div className="md:w-1/3 relative">
              <Image
                src="/placeholder-logo.svg"
                alt={article.title}
                width={300}
                height={150}
                className="rounded-lg w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <Link href={`/article/${article.slug}`}>
                <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
              </Link>
              <p className="text-gray-600 mb-3">{article.excerpt}</p>
              <div className="text-sm text-gray-500">{article.date}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
