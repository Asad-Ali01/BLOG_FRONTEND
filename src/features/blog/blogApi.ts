import { baseQueryWithReauth } from "@/api/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  ICreateBlogRequest,
  ICreateBlogResponse,
  IEditBlogRequest,
  IEditBlogResponse,
  IGetBlogByIdResponse,
  IGetMyAllBlogsResponse,
} from "./blog.types";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Blogs"],
  endpoints: (builder) => ({
    createBlogApi: builder.mutation<ICreateBlogResponse, ICreateBlogRequest>({
      query: (data) => ({
        url: "/blogs/create-blog",
        method: "POST",
        body: data,
      }),
        invalidatesTags:["Blogs"]

    }),
      editBlogApi: builder.mutation<IEditBlogResponse, IEditBlogRequest>({
        query: ({ _id, ...data }) => ({
          url: `/blogs/edit-blog/${_id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags:["Blogs"]
      }),
    deleteBlogApi: builder.mutation<{message:string;},{_id:string;}>({
      query: ({ _id }) => ({
        url: `/blogs/delete-blog/${_id}`,
        method: "DELETE",
      }),
      
    }),
    getBlogByIdApi: builder.query<IGetBlogByIdResponse,string>({
      query: (_id) => `/blogs/get-blog-by-id/${_id}`,
      providesTags: ["Blogs"]
    }),
    getAllBlogsApi: builder.query<IGetMyAllBlogsResponse,number>({
      query: (page=1) => `/blogs/get-all-blogs?page=${page}&limit=10`,
      providesTags: ["Blogs"]

    }),
    showMyAllBlogsApi: builder.query<IGetMyAllBlogsResponse,number>({
    query: (page=1) => `/blogs/show-my-all-blogs?page=${page}&limit=10`,
      providesTags: ["Blogs"]
    }),
  }),
});

export const {
  useCreateBlogApiMutation,
  useEditBlogApiMutation,
  useDeleteBlogApiMutation,
  useGetAllBlogsApiQuery,
  useShowMyAllBlogsApiQuery,
  useGetBlogByIdApiQuery
} = blogApi;