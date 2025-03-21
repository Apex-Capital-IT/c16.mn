import Image from "next/image"

export default function FeaturedNews() {
  return (
    <div className="featured-news">
      <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
        <Image
          src="/placeholder.svg?height=800&width=1200"
          alt="Featured news"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <div className="mb-2">
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">Breaking</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Economic Ecosystem Development Initiative Launched</h1>
          <p className="text-gray-200 mb-4 max-w-2xl">
            New program aims to strengthen local businesses and promote sustainable growth across multiple sectors...
          </p>
          <div className="flex items-center text-sm">
            <span className="mr-4">March 21, 2025</span>
            <span>By John Smith</span>
          </div>
        </div>
      </div>
    </div>
  )
}

