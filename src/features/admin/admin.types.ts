export interface GetUserInfoResponse{
  data:{
    username:string;
    avatar:{
      url:string;
      public_id:string;
    };
    role:"admin" | "user";
  }
}

export interface EditUserByAdmin{
    _id:string;
    username?:string;
    role?:"admin" | "user"
}

export interface EditUserByAdminFormData{
    username:string;
    role:"admin" | "user";
}