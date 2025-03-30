"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  ImageIcon,
  LinkIcon,
  Save,
  Eye,
  CircleDashed,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Quote,
  Code,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function PostEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTab, setSelectedTab] = useState("edit");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Calculate word count when content changes
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [content]);

  // Function to insert formatting into the content
  const insertFormatting = (format: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = "";
    let cursorOffset = 0;

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case "ul":
        formattedText = `\n- ${selectedText}`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case "ol":
        formattedText = `\n1. ${selectedText}`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case "link":
        formattedText = `[${selectedText || "Link text"}](url)`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case "h1":
        formattedText = `\n# ${selectedText}`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case "h2":
        formattedText = `\n## ${selectedText}`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case "quote":
        formattedText = `\n> ${selectedText}`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case "code":
        formattedText = `\`${selectedText}\``;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case "align-left":
        formattedText = `<div style="text-align: left">${selectedText}</div>`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case "align-center":
        formattedText = `<div style="text-align: center">${selectedText}</div>`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case "align-right":
        formattedText = `<div style="text-align: right">${selectedText}</div>`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + formattedText.length - cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add tag
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Format content for preview
  const formatContentForPreview = (text: string) => {
    // Simple markdown-like formatting
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n- (.*)/g, "<li>$1</li>")
      .replace(/\n\d+\. (.*)/g, "<li>$1</li>")
      .replace(
        /\[(.*?)\]$$(.*?)$$/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>'
      )
      .replace(/\n# (.*)/g, '<h1 class="text-2xl font-bold my-4">$1</h1>')
      .replace(/\n## (.*)/g, '<h2 class="text-xl font-bold my-3">$1</h2>')
      .replace(
        /\n> (.*)/g,
        '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>'
      )
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 px-1 rounded font-mono">$1</code>'
      )
      .replace(/\n/g, "<br />");

    // Wrap lists in ul/ol tags (simplified)
    if (formatted.includes("<li>")) {
      formatted = formatted
        .replace(/<li>/g, "<ul><li>")
        .replace(/<\/li>/g, "</li></ul>");
      // This is a simplification - a real implementation would properly nest list items
    }

    return formatted;
  };

  // Handle save
  const handleSave = (type: "draft" | "publish") => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSaveDialog(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select a category</option>
            <option value="politics">Politics</option>
            <option value="technology">Technology</option>
            <option value="sports">Sports</option>
            <option value="entertainment">Entertainment</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="featured">Featured Post</Label>
          <div className="flex items-center gap-2 h-10">
            <Switch
              id="featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
            />
            <span className="text-sm text-muted-foreground">
              {isFeatured
                ? "This post will be featured on the homepage"
                : "This post will not be featured"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex items-center gap-2">
          <Input
            id="tags"
            placeholder="Add a tag and press Enter"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  className="ml-1 rounded-full hover:bg-gray-200 h-4 w-4 inline-flex items-center justify-center"
                  onClick={() => removeTag(tag)}>
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="featured-image">Featured Image</Label>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById("image-upload")?.click()}
            className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Upload Image
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          {selectedImage && (
            <div className="relative h-20 w-32 overflow-hidden rounded border">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Featured"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">Content</Label>
          <div className="text-xs text-muted-foreground">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </div>
        </div>

        <div className="border rounded-md p-1 flex flex-wrap gap-1 bg-muted/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("bold")}
            title="Bold"
            className="h-8 w-8 p-0">
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("italic")}
            title="Italic"
            className="h-8 w-8 p-0">
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("h1")}
            title="Heading 1"
            className="h-8 w-8 p-0">
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("h2")}
            title="Heading 2"
            className="h-8 w-8 p-0">
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("quote")}
            title="Quote"
            className="h-8 w-8 p-0">
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("code")}
            title="Code"
            className="h-8 w-8 p-0">
            <Code className="h-4 w-4" />
          </Button>
          <div className="h-8 w-px bg-border mx-1"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("ul")}
            title="Bullet List"
            className="h-8 w-8 p-0">
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("ol")}
            title="Numbered List"
            className="h-8 w-8 p-0">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="h-8 w-px bg-border mx-1"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("align-left")}
            title="Align Left"
            className="h-8 w-8 p-0">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("align-center")}
            title="Align Center"
            className="h-8 w-8 p-0">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("align-right")}
            title="Align Right"
            className="h-8 w-8 p-0">
            <AlignRight className="h-4 w-4" />
          </Button>
          <div className="h-8 w-px bg-border mx-1"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("link")}
            title="Insert Link"
            className="h-8 w-8 p-0">
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" className="gap-2">
              <Bold className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-0">
            <Textarea
              id="content"
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </TabsContent>
          <TabsContent value="preview" className="mt-0">
            <Card
              className={cn(
                "min-h-[300px] p-4 overflow-auto",
                !content &&
                  "flex items-center justify-center text-muted-foreground"
              )}>
              {selectedImage && (
                <div className="mb-4">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt={title || "Featured image"}
                    className="max-h-[200px] rounded object-cover"
                  />
                </div>
              )}
              <h1 className="mb-4 text-2xl font-bold">
                {title || "Post Title"}
              </h1>

              {category && (
                <div className="mb-4">
                  <Badge className="bg-blue-100 text-blue-800">
                    {category}
                  </Badge>
                  {isFeatured && (
                    <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              )}

              {content ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatContentForPreview(content),
                  }}
                />
              ) : (
                <p>Your preview will appear here</p>
              )}

              {tags.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Tags:</div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex gap-2">
        <Button
          className="gap-2"
          onClick={() => handleSave("draft")}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <CircleDashed className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save as Draft
            </>
          )}
        </Button>
        <Button variant="outline">Preview</Button>
        <Button
          variant="secondary"
          onClick={() => handleSave("publish")}
          disabled={isSubmitting}>
          Publish
        </Button>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post Saved Successfully</DialogTitle>
            <DialogDescription>
              Your post has been saved as a draft. You can continue editing or
              publish it now.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Continue Editing
            </Button>
            <Button onClick={() => (window.location.href = "/admin/posts")}>
              Go to Posts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
