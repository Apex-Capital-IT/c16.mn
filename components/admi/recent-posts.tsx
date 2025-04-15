import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Post {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  views: number;
}

const recentPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "2 days ago",
    views: 1234,
  },
  {
    id: "2",
    title: "Understanding React Hooks",
    author: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "3 days ago",
    views: 987,
  },
  {
    id: "3",
    title: "Building a Blog with Next.js and Tailwind",
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "5 days ago",
    views: 2345,
  },
  {
    id: "4",
    title: "Advanced TypeScript Patterns",
    author: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "1 week ago",
    views: 1567,
  },
  {
    id: "5",
    title: "Optimizing Next.js Applications",
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "1 week ago",
    views: 876,
  },
];

export function RecentPosts() {
  return (
    <div className="space-y-8">
      {recentPosts.map((post) => (
        <div key={post.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.name}
            />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{post.title}</p>
            <p className="text-sm text-muted-foreground">
              By {post.author.name} • {post.date}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {post.views.toLocaleString()} views
          </div>
        </div>
      ))}
    </div>
  );
}
