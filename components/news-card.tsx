import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  slug: string;
  className?: string;
  imageSize?: "small" | "medium" | "large";
}

export default function NewsCard({
  category,
  title,
  excerpt,
  imageUrl,
  date,
  slug,
  className,
  imageSize = "medium",
}: NewsCardProps) {
  const imageHeight = {
    small: 150,
    medium: 200,
    large: 300,
  }[imageSize];

  return (
    <div
      className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}
    >
      <div className="relative">
        <Image
          src="/placeholder-logo.svg"
          alt={title}
          width={600}
          height={imageHeight}
          className="w-full h-auto object-cover"
        />
        <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium">
          {category}
        </div>
      </div>
      <div className="p-4">
        <Link href={`/article/${slug}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-3 line-clamp-2">{excerpt}</p>
        <div className="text-sm text-gray-500">{date}</div>
      </div>
    </div>
  );
}
