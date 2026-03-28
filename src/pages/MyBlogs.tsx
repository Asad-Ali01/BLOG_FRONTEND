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
import {
  useDeleteBlogApiMutation,
  useShowMyAllBlogsApiQuery,
} from "@/features/blog/blogApi";
import { useAppSelector } from "@/features/auth/auth.types";
import { Delete, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DeleteConfirmModal from "@/components/ui/delete-blog-modal";
import type { IBlog } from "@/features/blog/blog.types";
function MyBlogs() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [blogId, setBlogId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [allBlogs, setAllBlogs] = useState<IBlog[]>([]);
  const { data: blogs, isFetching } = useShowMyAllBlogsApiQuery(page);

  useEffect(() => {
    if (blogs?.data.blogs) {
      setAllBlogs((prev) => [...(prev ?? []), ...blogs.data.blogs]);
    }
  }, [blogs]);
  const observer = useRef<IntersectionObserver | null>(null);
  const [deleteBlogApi, { isLoading: deleteBlogLoading }] =
    useDeleteBlogApiMutation();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id)
        ? prev.filter((expandedId) => expandedId !== id)
        : [...prev, id],
    );
  };
  const navigate = useNavigate();
  const handleEditBlog = (value: string) => {
    navigate(`/edit-blog/${value}`);
  };
  const blogIdToDelete = (id: string) => {
    setBlogId(id);
    setIsModalOpen(true);
  };
  const lastBlogref = useCallback(
    (node: HTMLDivElement) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && blogs?.data?.hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, blogs],
  );

  const handleConfirmDelete = async () => {
    const res = await deleteBlogApi({ _id: blogId }).unwrap();
    return res;
  };

  return (
    <div
      className={`grid gap-3 grid-cols-1  lg:grid-cols-2 xl:grid-cols-3  2xl:grid-cols-5 place-items-center ${blogs?.data.blogs.length === 0 && "h-full"} ${!isAuthenticated ? "py-10" : "pb-10"}`}
    >
      {allBlogs.length === 0 ? (
        <h2 className="text-2xl bg-linear-to-r from-white via-blue-500 to-blue-900 bg-clip-text text-transparent">
          No Blogs Found
        </h2>
      ) : (
        allBlogs.map((blog: IBlog, index) => {
          const isExpanded = expandedIds.includes(blog._id);

          return (
            <div
              key={blog._id}
              ref={index == allBlogs.length - 1 ? lastBlogref : null}
            >
              <Card className="w-67 sm:w-90 lg:w-75">
                <CardHeader className="flex items-center justify-between w-full ">
                  <div className="flex justify-between items-center gap-1 w-[60%]">
                    <CardTitle className="truncate ">{blog.title}</CardTitle>
                    <Button variant="outline" size="xs">
                      {blog.status}
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => handleEditBlog(blog._id)}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => blogIdToDelete(blog._id)}
                    >
                      <Delete />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div>
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
                <CardFooter className="flex gap-2 items-center ">
                  <Avatar>
                    {blog.author.avatar ? (
                      <AvatarImage src={blog.author.avatar.url} />
                    ) : (
                      <AvatarFallback>{blog.author.username[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <p className="font-bold pt-4">{blog.author.username}</p>
                </CardFooter>
              </Card>
            </div>
          );
        })
      )}
      <DeleteConfirmModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        descriptionText="This will permanently delete your blog"
        onConfirmMessage="Blog deleted successfully"
        onConfirm={handleConfirmDelete}
        isLoading={deleteBlogLoading}
      />
    </div>
  );
}

export default MyBlogs;
