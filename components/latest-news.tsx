import Link from "next/link"
import { Clock } from "lucide-react"

export default function LatestNews() {
  const latestArticles = [
    {
      title: "Stock Market Closes at Record High Despite Economic Concerns",
      time: "2 hours ago",
      slug: "stock-market-record-high",
    },
    {
      title: "New Environmental Protection Measures Announced",
      time: "3 hours ago",
      slug: "environmental-protection-measures",
    },
    {
      title: "Major Tech Company Unveils Revolutionary AI Assistant",
      time: "5 hours ago",
      slug: "tech-company-ai-assistant",
    },
    {
      title: "International Film Festival Announces This Year's Lineup",
      time: "6 hours ago",
      slug: "film-festival-lineup",
    },
    {
      title: "Sports Star Signs Record-Breaking Contract with Team",
      time: "8 hours ago",
      slug: "sports-star-contract",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-bold">Latest News</h3>
      </div>
      <div className="space-y-4">
        {latestArticles.map((article, index) => (
          <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
            <Link href={`/article/${article.slug}`}>
              <h4 className="font-medium hover:text-blue-600 transition-colors mb-1">{article.title}</h4>
            </Link>
            <div className="text-sm text-gray-500">{article.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

