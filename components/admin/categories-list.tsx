import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function CategoriesList() {
  // Sample data - in a real app, this would come from your database
  const categories = [
    {
      id: 1,
      name: "Politics",
      slug: "politics",
      postCount: 12,
      color: "bg-red-100 text-red-800",
    },
    {
      id: 2,
      name: "Technology",
      slug: "technology",
      postCount: 24,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 3,
      name: "Sports",
      slug: "sports",
      postCount: 18,
      color: "bg-green-100 text-green-800",
    },
    {
      id: 4,
      name: "Entertainment",
      slug: "entertainment",
      postCount: 15,
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: 5,
      name: "Business",
      slug: "business",
      postCount: 9,
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Posts</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <Badge className={category.color}>{category.name}</Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {category.slug}
              </TableCell>
              <TableCell>{category.postCount}</TableCell>
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
