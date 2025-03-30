import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function PostsList() {
  // Sample data - in a real app, this would come from your database
  const posts = [
    {
      id: 1,
      title: "Getting Started with Next.js",
      author: "John Doe",
      date: "2023-05-15",
      status: "Published",
    },
    {
      id: 2,
      title: "The Future of Web Development",
      author: "Jane Smith",
      date: "2023-05-10",
      status: "Draft",
    },
    {
      id: 3,
      title: "Understanding React Hooks",
      author: "John Doe",
      date: "2023-05-05",
      status: "Published",
    },
    {
      id: 4,
      title: "Building Responsive UIs",
      author: "Jane Smith",
      date: "2023-04-28",
      status: "Draft",
    },
  ];

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>{post.date}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    post.status === "Published" ? "default" : "secondary"
                  }>
                  {post.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
