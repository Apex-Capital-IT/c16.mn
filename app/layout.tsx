import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "c16 - Latest Breaking News",
  description:
    "Get the latest breaking news and top stories from around the world",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        > */}
        <div className="flex flex-col min-h-screen">
          {/* <Header /> */}
          <div className="flex-grow">{children}</div>
          {/* <Footer /> */}
        </div>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}

import "./globals.css";
import EmailSubscription from "@/components/email";
