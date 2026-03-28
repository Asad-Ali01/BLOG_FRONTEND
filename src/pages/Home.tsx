import { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetAllBlogsApiQuery } from "@/features/blog/blogApi";
import { useAppSelector } from "@/features/auth/auth.types";
import type { IBlog } from "@/features/blog/blog.types";

function Home() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [page,setPage] = useState<number>(1);
  const [allBlogs,setAllBlogs] = useState<IBlog[]>([])
  
  const { data: blogs, isFetching } = useGetAllBlogsApiQuery(page);
   useEffect(() => {
     const data = blogs?.data.blogs
    if(data){
      setAllBlogs((prev) => [...prev,...data])
    }
   },[blogs?.data.blogs])
   const observer = useRef<IntersectionObserver | null>(null)
   const lastBlogref = useCallback((node:HTMLDivElement) => {
    if(isFetching) return;
    observer.current?.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting && blogs?.data.hasMore){
        setPage(prev => prev + 1);
      }
    })
    if(node) observer.current.observe(node);
   },[isFetching,blogs])
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id)
        ? prev.filter((expandedId) => expandedId !== id)
        : [...prev, id],
    );
  };
 
  const publishedBlogs = allBlogs.filter((blog) => blog.status === "published") ?? [];

  return (
    <div className={`mx-auto w-full max-w-7xl px-4 ${!isAuthenticated ? "py-10" : "pb-10"}`}>
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-bold tracking-tight">Latest Blogs</h1>
        <p className="text-sm text-muted-foreground">Fresh stories from the community</p>
      </div>

      <div className="grid  gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {publishedBlogs.map((blog,index) => {
        const isExpanded = expandedIds.includes(blog._id);
        return (
          <Card
            className="group overflow-hidden m-0 p-0  w-full border border-border/70 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            key={blog._id}
            ref={index == publishedBlogs.length - 1 ? lastBlogref : null }
          >
            <CardHeader className="min-w-0  space-y-3 border-b bg-linear-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
              <div className="text-xs font-semibold uppercase pt-2 tracking-wide text-muted-foreground">
                Title
              </div>
              <CardTitle className="min-w-0 text-left text-lg leading-snug whitespace-normal  wrap-anywhere">
                {blog.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
               <div className="text-xs font-semibold  uppercase  tracking-wide text-muted-foreground">
                Description
              </div>
              <p
                className={`text-sm leading-7 text-left text-foreground/90 ${
                  !isExpanded ? "line-clamp-4" : ""
                }`}
              >
                {blog.content}
              </p>
              {blog.content.length > 100 && (
                <div className="mt-3 text-right">
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm"
                    onClick={() => toggleExpand(blog._id)}
                  >
                    {isExpanded ? "Read less" : "Read more"}
                  </Button>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex items-center gap-3 border-t bg-muted/30">
              <Avatar>
                {blog.author.avatar ? (
                  <AvatarImage src={blog.author.avatar.url} />
                ) : (
                  <AvatarFallback>{blog.author.username[0]}</AvatarFallback>
                )}
              </Avatar>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Author</p>
                <p className="text-sm font-semibold">{blog.author.username}</p>
              </div>
            </CardFooter>
          </Card>
        );
      })}
      </div>
    </div>
  );
}

export default Home;
