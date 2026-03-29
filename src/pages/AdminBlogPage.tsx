import { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  useDeleteBlogApiMutation,
  useGetAllBlogsApiQuery,
} from "@/features/blog/blogApi";
import { Button } from "antd";
import { useAppSelector } from "@/features/auth/auth.types";
import { Delete } from "lucide-react";
import DeleteConfirmModal from "@/components/shared/delete-blog-modal";
import type { IBlog } from "@/features/blog/blog.types";
function AdminPage() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
   const [page,setPage] = useState<number>(1);
    const [allBlogs,setAllBlogs] = useState<IBlog[]>([])
    
  const { data: blogs, isFetching,isLoading } = useGetAllBlogsApiQuery(page);
   useEffect(() => {
       const data = blogs?.data.blogs
      if(data){
        setAllBlogs((prev) => {
          const ids = new Set(prev.map((b) => b._id));
          const filtered = data.filter((b) => !ids.has(b._id));
          return [...prev,...filtered]
        })
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
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [blogId, setBlogId] = useState("");
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [deleteBlogApi] = useDeleteBlogApiMutation();

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id)
        ? prev.filter((expandedId) => expandedId !== id)
        : [...prev, id],
    );
  };
  const handleDelete = (id: string) => {
    setBlogId(id);
    setIsDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
         const res = await deleteBlogApi({ _id: blogId }).unwrap();
          setAllBlogs((prev) => prev.filter((b) => b._id !== blogId));
          return res;
        }
  return (
    <div
      className={`grid   justify-center  gap-10 ${!isAuthenticated ? "py-10" : "pb-10"}`}
    >
      {allBlogs.map((blog,index) => {
        const isExpanded = expandedIds.includes(blog._id);
        if (blog.status === "published") {
          return (
            <div className="grid  " key={blog._id}  ref={index == allBlogs.length - 1 ? lastBlogref : null }>
              <Card className="w-70 sm:w-120 lg:w-180 xl:w-230 2xl:w-300">
                <CardHeader className="flex justify-between">
                  <div className="flex gap-1 flex-col  text-left  ">
                    <h1 className="pt-2 font-bold bg-linear-to-r bg-clip-text text-transparent from-blue-900 to-blue-600  text-xl  tracking-wide">
                      Title
                    </h1>
                    <CardTitle >{blog.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleDelete(blog._id)}>
                      <Delete />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div>
                    <h1
                      className={`bg-linear-to-r bg-clip-text text-transparent from-blue-900 to-blue-600  text-xl text-start `}
                    >
                      Description
                    </h1>
                    <p
                      className={`text-sm dark:text-white text-gray-700 text-left ${
                        !isExpanded ? "line-clamp-4" : ""
                      }`}
                    >
                      {blog.content}
                    </p>
                    {blog.content.length > 100 && (
                      <div className="text-right">
                        {isExpanded ? (
                          <Button
                            variant="link"
                            className=" pt-6 px-0 "
                            onClick={() => toggleExpand(blog._id)}
                          >
                            Read less
                          </Button>
                        ) : (
                          <Button
                            variant="link"
                            className=" pt-6 px-0  right-0"
                            onClick={() => toggleExpand(blog._id)}
                          >
                            Read more
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <h1 className="bg-linear-to-r bg-clip-text text-transparent from-blue-900 to-blue-600  text-xl ">
                    Author
                  </h1>
                  <div className="flex gap-2 items-center">
                    <Avatar>
                      {blog.author.avatar ? (
                        <AvatarImage src={blog.author.avatar.url} />
                      ) : (
                        <AvatarFallback>
                          {blog.author.username[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <p className="font-bold pt-5">{blog.author.username}</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          );
        }
      })}
      <DeleteConfirmModal
        isModalOpen={isDeleteModal}
        setIsModalOpen={setIsDeleteModal}
        isLoading={isLoading}
        onConfirmMessage="Blog deleted successfully"
        onConfirm={handleDeleteConfirm}
        descriptionText="This will permanently delete this blog"
      />
    </div>
  );
}

export default AdminPage;
