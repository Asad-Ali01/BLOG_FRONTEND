import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createBlogSchema,
  type createBlogSchemaType,
} from "@/schemas/createBlogSchema";
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
import { useCreateBlogApiMutation } from "@/features/blog/blogApi";
import toast from "react-hot-toast";
import { Button } from "antd";
import { Textarea } from "@/components/ui/textarea";

function CreateBlog() {
  const form = useForm<createBlogSchemaType>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
  });
  const [createBlogApi] = useCreateBlogApiMutation();
   const handleCreateBlog = async (data: createBlogSchemaType) => {
    try {
   await createBlogApi(data).unwrap()
      toast.success("Successfully created blog");
      form.reset();
    } catch (error:any) {
      toast.error(error.data.message)
    }
  };

  return (
    <div className="grid place-items-center  w-full h-full ">
     
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateBlog)}  className="w-[90%] sm:w-[70%] grid gap-3">
           <h1 className="font-bold text-2xl">Create Blog</h1>
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
                  <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  >
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
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type="primary" htmlType="submit" className="w-full mt-5">
            Create Blog
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreateBlog;
