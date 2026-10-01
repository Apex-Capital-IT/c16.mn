// Static mock data — the site runs entirely without a backend.
import type { NewsArticle } from "@/lib/axios";

export interface MockCategory {
  _id: string;
  categoryName: string;
  slug: string;
}

export interface MockAuthor {
  _id: string;
  authorName: string;
  authorImage: string;
  bio: string;
}

export const mockCategories: MockCategory[] = [
  { _id: "c1", categoryName: "Нийгэм, Улс Төр", slug: "politics" },
  { _id: "c2", categoryName: "Эдийн Засаг", slug: "economy" },
  { _id: "c3", categoryName: "Бусад", slug: "other" },
  { _id: "c4", categoryName: "Нийтлэлчид", slug: "bloggers" },
  { _id: "c5", categoryName: "Видео Контент", slug: "video" },
];

export const mockAuthors: MockAuthor[] = [
  { _id: "a1", authorName: "Б.Болд", authorImage: "https://i.pravatar.cc/150?img=12", bio: "Улс төрийн тоймч" },
  { _id: "a2", authorName: "Д.Сараа", authorImage: "https://i.pravatar.cc/150?img=47", bio: "Эдийн засгийн сэтгүүлч" },
  { _id: "a3", authorName: "Г.Тэмүүлэн", authorImage: "https://i.pravatar.cc/150?img=33", bio: "Нийгмийн сурвалжлагч" },
  { _id: "a4", authorName: "О.Номин", authorImage: "https://i.pravatar.cc/150?img=45", bio: "Видео продюсер" },
];

const titles: [string, string][] = [
  ["Улсын Их Хурал шинэ хуулийн төслийг хэлэлцлээ", "c1"],
  ["Засгийн газар төсвийн тодотголыг баталлаа", "c1"],
  ["Сонгуулийн хууль шинэчлэгдэх нь", "c1"],
  ["Төгрөгийн ханш тогтвортой байна", "c2"],
  ["Уул уурхайн экспорт 20 хувиар өслөө", "c2"],
  ["Инфляц нэг оронтой тоонд буулаа", "c2"],
  ["Монголбанк бодлогын хүүг өөрчлөхгүй", "c2"],
  ["Улаанбаатарт шинэ цэцэрлэгт хүрээлэн нээгдлээ", "c3"],
  ["Наадмын бэлтгэл ажил эхэллээ", "c3"],
  ["Цахим шилжилтийн шинэ үе шат", "c3"],
  ["Нийтлэлч: Хотын түгжрэлийг хэрхэн шийдэх вэ", "c4"],
  ["Нийтлэлч: Боловсролын шинэчлэл ба ирээдүй", "c4"],
  ["Видео: Говийн үзэсгэлэнт байгаль", "c5"],
  ["Видео: Хөвсгөл нуурын өвөл", "c5"],
  ["Видео: Залуу малчдын нэг өдөр", "c5"],
];

const paragraph =
  "Энэ бол жишээ мэдээний агуулга юм. Мэдээллийн хэрэгслийн загвар (mock-up) сайтын хувьд бүх өгөгдөл статик бөгөөд сервертэй холбогдохгүй. ";

export const mockNews: NewsArticle[] = titles.map(([title, catId], i) => {
  const cat = mockCategories.find((c) => c._id === catId)!;
  const author = mockAuthors[i % mockAuthors.length];
  const date = new Date(Date.UTC(2026, 8, 30 - i, 8 + (i % 10))).toISOString();
  return {
    _id: `n${i + 1}`,
    title,
    description: `${title} — дэлгэрэнгүй мэдээллийг уншина уу.`,
    content: `<p>${paragraph.repeat(3)}</p><p>${paragraph.repeat(4)}</p><p>${paragraph.repeat(2)}</p>`,
    category: cat.slug,
    categoryName: cat.categoryName,
    newsImages: [`https://picsum.photos/seed/c16-${i + 1}/1200/675`],
    authorName: author.authorName,
    authorId: author._id,
    authorImage: author.authorImage,
    banner: i < 3,
    slug: `n${i + 1}`,
    publishedDate: date,
    createdAt: date,
    updatedAt: date,
    views: 1200 - i * 57,
  };
});

export const getNewsById = (id: string) =>
  mockNews.find((n) => n._id === id || n.slug === id);
export const getNewsByCategory = (slug: string) =>
  mockNews.filter((n) => n.category === slug);
