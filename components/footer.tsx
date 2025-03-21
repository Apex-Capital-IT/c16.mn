"use client";
import Link from "next/link";
import { Twitter, Facebook, Youtube, Rss } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 py-4 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <Link href="/" className="font-bold text-xl">
                <span className="text-black">c16</span>
                <span className="text-gray-500">.mn</span>
              </Link>
            </div>
            <div className="flex space-x-2 mt-2">
              <Link href="#" className="text-blue-400 hover:text-blue-600">
                <Twitter size={16} />
              </Link>
              <Link href="#" className="text-blue-600 hover:text-blue-800">
                <Facebook size={16} />
              </Link>
              <Link href="#" className="text-red-600 hover:text-red-800">
                <Youtube size={16} />
              </Link>
              <Link href="#" className="text-orange-500 hover:text-orange-700">
                <Rss size={16} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <div>Copyright © 2025 c16.mn</div>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/help" className="hover:text-gray-700">
              Тусламж
            </Link>
            <Link href="/advertisement" className="hover:text-gray-700">
              Сурталчилгаа
            </Link>
            <Link href="/contact" className="hover:text-gray-700">
              Холбоо
            </Link>
            <Link href="/sitemap" className="hover:text-gray-700">
              Сайтмап
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
