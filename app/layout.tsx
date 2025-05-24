import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://c16.mn"),
  title: "c16 - Latest Breaking News",
  description:
    "Get the latest breaking news and top stories from around the world",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "c16 - Latest Breaking News",
    description:
      "Get the latest breaking news and top stories from around the world",
    images: [
      {
        url: "/favicon.ico",
        width: 32,
        height: 32,
        alt: "c16 Logo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  sitemap: "https://c16.mn/sitemap.xml",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
