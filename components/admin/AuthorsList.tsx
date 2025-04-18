// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { Author, fallbackAuthorData } from "@/lib/axios";
// import { Button } from "@/components/ui/button";

// export default function AuthorsList() {
//   const [authors, setAuthors] = useState<Author[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [totalAuthors, setTotalAuthors] = useState(0);

//   useEffect(() => {
//     const fetchAuthors = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/authors?page=${page}&limit=6`);
//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.error || "Failed to fetch authors");
//         }
        
//         // Get total count from headers
//         const totalCount = parseInt(response.headers.get('X-Total-Count') || '0');
//         setTotalAuthors(totalCount);
        
//         // Check if there are more pages
//         setHasMore(page * 6 < totalCount);
        
//         // If it's the first page, replace authors, otherwise append
//         if (page === 1) {
//           setAuthors(data.authors || []);
//         } else {
//           setAuthors(prev => [...prev, ...(data.authors || [])]);
//         }
//       } catch (error) {
//         console.error("Error fetching authors:", error);
//         toast.error("Зохиолчдын жагсаалтыг авахад алдаа гарлаа");
        
//         // Use fallback data in case of error
//         if (page === 1) {
//           setAuthors(fallbackAuthorData);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAuthors();
//   }, [page]);

//   const loadMore = () => {
//     setPage(prev => prev + 1);
//   };

//   if (loading && page === 1) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {[1, 2, 3].map((i) => (
//           <Card key={i}>
//             <CardHeader>
//               <Skeleton className="h-4 w-3/4" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-48 w-full" />
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     );
//   }

//   if (authors.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500">Зохиолч олдсонгүй</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {authors.map((author) => (
//           <Card key={author._id}>
//             <CardHeader>
//               <h3 className="text-lg font-semibold">{author.authorName}</h3>
//             </CardHeader>
//             <CardContent>
//               <div className="relative aspect-square w-full overflow-hidden rounded-lg">
//                 <Image
//                   src={author.authorImage}
//                   alt={author.authorName}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
      
//       {hasMore && (
//         <div className="mt-6 text-center">
//           <Button 
//             onClick={loadMore} 
//             disabled={loading}
//             variant="outline"
//           >
//             {loading ? "Уншиж байна..." : "Дараагийн"}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
