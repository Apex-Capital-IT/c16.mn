// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import { Clock, Edit } from "lucide-react";

// export function RecentPosts() {
//   // Sample data - in a real app, this would come from your database
//   const recentPosts = [
//     {
//       id: 1,
//       title: "Getting Started with Next.js",
//       date: "2023-05-15",
//       category: "Technology",
//       categoryColor: "bg-blue-100 text-blue-800",
//     },
//     {
//       id: 3,
//       title: "Understanding React Hooks",
//       date: "2023-05-05",
//       category: "Technology",
//       categoryColor: "bg-blue-100 text-blue-800",
//     },
//     {
//       id: 5,
//       title: "The Future of AI in Business",
//       date: "2023-05-01",
//       category: "Business",
//       categoryColor: "bg-yellow-100 text-yellow-800",
//     },
//   ];

//   return (
//     <div className="space-y-4">
//       {recentPosts.map((post) => (
//         <div
//           key={post.id}
//           className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
//           <div className="space-y-1">
//             <Link
//               href={`/admin/posts/${post.id}`}
//               className="font-medium hover:underline">
//               {post.title}
//             </Link>
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <Badge className={post.categoryColor}>{post.category}</Badge>
//               <div className="flex items-center gap-1">
//                 <Clock className="h-3 w-3" />
//                 {post.date}
//               </div>
//             </div>
//           </div>
//           <Link
//             href={`/admin/posts/${post.id}/edit`}
//             className="rounded-full p-1 hover:bg-gray-100">
//             <Edit className="h-4 w-4 text-muted-foreground" />
//             <span className="sr-only">Edit</span>
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// }
