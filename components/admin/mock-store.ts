// In-memory mock store for the admin mock-up. Nothing is persisted:
// changes live in module state and survive client-side navigation only.
import { mockNews, mockCategories, mockAuthors } from "@/lib/mock-data";
import type { NewsArticle } from "@/lib/axios";

export interface AdminCategory {
  _id: string;
  categoryName: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuthor {
  _id: string;
  authorName: string;
  authorImage: string;
  bio: string;
  socialMedia?: string;
  createdAt: string;
}

const baseDate = new Date(Date.UTC(2026, 0, 15)).toISOString();

export const adminStore = {
  news: mockNews.map((n) => ({ ...n, newsImages: [...n.newsImages] })) as NewsArticle[],
  categories: mockCategories.map((c) => ({
    ...c,
    createdAt: baseDate,
    updatedAt: baseDate,
  })) as AdminCategory[],
  authors: mockAuthors.map((a) => ({
    ...a,
    socialMedia: "",
    createdAt: baseDate,
  })) as AdminAuthor[],
};

export type AdminCollection = keyof typeof adminStore;

let counter = 1000;
export const newId = (prefix: string) => `${prefix}${++counter}`;

export const nowIso = () => new Date().toISOString();

export const fakeDelay = (ms = 400) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export function collectionFromEndpoint(endpoint: string): AdminCollection {
  if (endpoint.includes("categor")) return "categories";
  if (endpoint.includes("author")) return "authors";
  return "news";
}

export function removeFromStore(collection: AdminCollection, id: string) {
  const list = adminStore[collection] as { _id: string }[];
  const idx = list.findIndex((x) => x._id === id);
  if (idx >= 0) list.splice(idx, 1);
}

export function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}-]/gu, "") || newId("item-")
  );
}

export const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
