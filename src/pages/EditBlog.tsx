import  { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  editBlogSchema,
  type editBlogSchemaType,
} from "@/schemas/editBlogSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditBlogApiMutation,
  useGetBlogByIdApiQuery,
} from "@/features/blog/blogApi";
import toast from "react-hot-toast";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const skipQuery = !id;
  const { data, isLoading: BlogLoading } = useGetBlogByIdApiQuery(id!, {
    skip: skipQuery,
  });
  const [editBlogApi] = useEditBlogApiMutation();
  const form = useForm<editBlogSchemaType>({
    resolver: zodResolver(editBlogSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (data?.data) {
      form.reset({
        title: data.data.title,
        content: data.data.content,
        status: data.data.status,
      });
    }
  }, [data, form]);
  if (!data?.data && !BlogLoading) return <p>Blog not found!</p>;
  const handleEditBlog = async (formData: editBlogSchemaType) => {
    if (!id) return toast.error("Blog ID not found");
    try {
     const res = await editBlogApi({ ...formData, _id: id }).unwrap();
      toast.success(res.message);
      navigate('/my-blogs')
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };
  return (
    <div className="grid   place-items-center w-full h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleEditBlog)}
          className="w-[90%] sm:w-[70%] grid gap-4"
        >
          <h1 className="font-bold text-2xl">Edit Blog</h1>

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter title"
                    className={`${!fieldState.error ? "mb-4" : "mb-0"}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Description */}
          <FormField
            control={form.control}
            name="content"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className={`w-full h-40 ${!fieldState.error ? "mb-4" : "mb-0"}`}
                    placeholder="Write your blog description"
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue placeholder="Select blog status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="primary" htmlType="submit" className="w-full mt-5">Edit Blog</Button>
        </form>
      </Form>
    </div>
  );
}

export default EditBlog;
