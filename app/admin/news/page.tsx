"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { PlusCircle, Search } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  authorImage: string;
  publishedAt: string;
}

export default function NewsAdminPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newNews, setNewNews] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    imageUrl: "",
    author: "",
  });

  // Fetch news items
  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/news?search=${searchTerm}`);
      const data = await response.json();
      setNewsItems(data.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [searchTerm]);

  // Create new news item
  const handleCreateNews = async () => {
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNews),
      });

      if (response.ok) {
        setNewNews({
          title: "",
          description: "",
          content: "",
          category: "",
          imageUrl: "",
          author: "",
        });
        setIsCreating(false);
        fetchNews();
      }
    } catch (error) {
      console.error("Error creating news:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Мэдээний удирдлага</h1>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {isCreating ? "Болих" : "Шинэ мэдээ"}
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Мэдээ хайх..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Шинэ мэдээ нэмэх</CardTitle>
            <CardDescription>
              Мэдээний мэдээллийг оруулна уу
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Гарчиг</Label>
                <Input
                  id="title"
                  value={newNews.title}
                  onChange={(e) =>
                    setNewNews({ ...newNews, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Товч тайлбар</Label>
                <Input
                  id="description"
                  value={newNews.description}
                  onChange={(e) =>
                    setNewNews({ ...newNews, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Агуулга</Label>
                <Textarea
                  id="content"
                  value={newNews.content}
                  onChange={(e) =>
                    setNewNews({ ...newNews, content: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Ангилал</Label>
                <Input
                  id="category"
                  value={newNews.category}
                  onChange={(e) =>
                    setNewNews({ ...newNews, category: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Зургийн URL</Label>
                <Input
                  id="imageUrl"
                  value={newNews.imageUrl}
                  onChange={(e) =>
                    setNewNews({ ...newNews, imageUrl: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Зохиолч</Label>
                <Input
                  id="author"
                  value={newNews.author}
                  onChange={(e) =>
                    setNewNews({ ...newNews, author: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleCreateNews}>Нэмэх</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Мэдээний жагсаалт</CardTitle>
          <CardDescription>Бүх мэдээний жагсаалт</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Гарчиг</TableHead>
                <TableHead>Ангилал</TableHead>
                <TableHead>Зохиолч</TableHead>
                <TableHead>Огноо</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 