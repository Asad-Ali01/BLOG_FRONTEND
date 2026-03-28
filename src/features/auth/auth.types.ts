import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { type AppDispatch, type RootState } from "@/app/store";
export interface IAvatar{
    url: string;
    public_id:string
}

export interface IUser{
    _id:string;
    username:string;
    avatar?:IAvatar;
    role:"user" | "admin";
    createdAt:Date;
    updatedAt:Date;
}

export interface IAuthState{
    user:IUser | null;
    accessToken:string | null;
    isAuthenticated: boolean;
}
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {
    user: IUser;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterRequest{
  username:string;
  password:string;
  confirmPassword:string;
  avatar?:File;
}

export interface RegisterResponse{
  data:{
    user:IUser;
    accessToken:string;
    refreshToken:string;
  }
}

export interface EditUserNameRequest{
  username:string 
}
export interface EditUserResponse{
  data:{
    user:IUser
  }
}
export interface GetAllUsersResponse {
  data: {
    users:IUser[],
    nextCursor:string,
    limit:number
  };
}



export interface EditUserPasswordRequest{
oldPassword:string;
newPassword:string;
confirmPassword:string;
}
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
