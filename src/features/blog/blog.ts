import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IBlogState, IBlog, IEditBlog } from "./blog.types";
const initialState: IBlogState = {
  blogs: [],
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    createBlog: (state, action: PayloadAction<{ blog: IBlog }>) => {
      const blog = action.payload.blog;
      state.blogs.push(blog);
    },
    editBlog: (state, action: PayloadAction<IEditBlog>) => {
      const blog = state.blogs.find((b) => b._id === action.payload._id);
      if (blog) {
        if (action.payload.title) {
          blog.title = action.payload.title;
        }
        if (action.payload.content) {
          blog.content = action.payload.content;
        }
        blog.status = action.payload.status;
      }
    },
    deleteBlog: (state,action:PayloadAction<{blogId:string}>) => {
       state.blogs = state.blogs.filter(blog => blog._id !== action.payload.blogId);
    }
  },
});
export const{createBlog,editBlog,deleteBlog} = blogSlice.actions;
export default blogSlice.reducer