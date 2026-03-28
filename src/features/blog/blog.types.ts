export interface IBlog {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
    avatar: {
      url: string;
    };
  };

  status: "draft" | "published";
}

export interface IBlogState {
  blogs: IBlog[];
}
export interface IEditBlog {
  _id: string;
  title?: string;
  content?: string;
  status: "draft" | "published";
}

export interface ICreateBlogRequest {
  title: string;
  content: string;
  status: "draft" | "published";
}
export interface IEditBlogRequest extends IEditBlog {
  title?: string;
  content?: string;
  status: "draft" | "published";
}
export interface IEditBlogResponse  {
  data:IBlog,
  message:string;
}
export interface ICreateBlogResponse extends IBlog {}
export interface IDeleteBlogRequest {
  blogId: string;
}
export interface IGetBlogByIdResponse {
  data: {
    _id: string;
    title: string;
    content: string;
    author: {
      username: string;
      avatar: {
        url: string;
      };
    };

    status: "draft" | "published";
  };
}
export interface IGetAllBlogsResponse{
    data:IBlog[]
}
export interface IGetMyAllBlogsResponse {
  data: {
    blogs: IBlog[];
    page: number;
    total: number;
    hasMore: boolean;
  };
}
