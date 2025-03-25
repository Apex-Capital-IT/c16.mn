"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import type { Article } from "@/lib/db";

const categories = [
  { name: "Нийгэм, Улс Төр", href: "/category/politics" },
  { name: "Эдийн Засаг", href: "/category/economy" },
  { name: "Бусад", href: "/category/other" },
  { name: "Нийтлэлчид", href: "/category/bloggers" },
  { name: "Видео Контент", href: "/category/video" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data.articles);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search on enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Navigate to article and reset search
  const handleResultClick = (slug: string) => {
    router.push(`/article/${slug}`);
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <header className="bg-white text-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">c16.mn</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            {categories.map((category, index) => (
              <div key={category.name} className="flex items-center">
                <Link
                  href={category.href}
                  className="text-sm font-medium hover:text-red-500 transition-colors px-4 py-3"
                >
                  {category.name}
                </Link>
                {index < categories.length - 1 && (
                  <div className="h-6 w-px bg-gray-300"></div>
                )}
              </div>
            ))}
          </nav>

          {/* Search and Mobile Menu Buttons */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:text-red-500 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 ml-2 md:hidden hover:text-red-500 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-800" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-white text-black px-4 py-2 rounded-md focus:outline-none border-[1px] border-black "
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Submit search"
              >
                <Search size={18} />
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto">
                <div className="p-2 text-sm text-gray-500 border-b">
                  {searchResults.length} results found
                </div>
                <ul>
                  {searchResults.map((article) => (
                    <li key={article.id} className="border-b last:border-0">
                      <button
                        onClick={() => handleResultClick(article.slug)}
                        className="w-full text-left p-3 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {article.title}
                            </h4>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                                {article.category}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {article.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isLoading && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg p-4 text-center">
                <div className="animate-pulse">Searching...</div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-800">
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="block py-2 hover:text-red-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
