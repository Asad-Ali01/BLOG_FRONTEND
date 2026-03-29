import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { EditUserNameRequest, EditUserPasswordRequest, EditUserResponse, GetAllUsersResponse,  LoginRequest, LoginResponse, RegisterResponse } from "./auth.types";
import {type RootState } from "@/app/store";
import { baseQueryWithReauth } from "@/api/baseQuery";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const rawBaseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
    prepareHeaders:(headers,{getState}) => {
      const token = (getState() as RootState).auth.accessToken;

      if(token){
        headers.set("authorization",`Bearer ${token}`)
      }

      return headers;
    }
  })

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    loginUserApi: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    registerUserApi: builder.mutation<RegisterResponse,FormData>({
        query: (credentials) => ({
            url:"/users/register",
            method:"POST",
            body:credentials
        })
    }),
    logoutUserApi: builder.mutation<void,void>({
      query:() => ({
        url:"/users/logout",
        method:"POST"
      })
    }),
    updateUserNameApi: builder.mutation<EditUserResponse,EditUserNameRequest>({
      query:(credentials) => ({
        url:"/users/update-user-name",
        method:"PATCH",
        body:credentials
      })
    }),
    updateUserPasswordApi: builder.mutation<{},EditUserPasswordRequest>({
      query:(credentials) => ({
        url:"/users/update-user-password",
        method:"PATCH",
        body:credentials
      })
    }),
    updateUserAvatarApi: builder.mutation<EditUserResponse,FormData>({
      query:(credentials) => ({
        url:"/users/update-user-avatar",
        method:"PATCH",
        body:credentials
      })
    }),
    getAllUserApi: builder.query<GetAllUsersResponse,void>({
      query: () => "/users/all-users"
    }),
    refreshToken: builder.mutation<EditUserResponse,void>({
      query:() => ({
        url:"/users/refresh-token",
        method:"POST"
      })
    })
  }),
});


export const {useLoginUserApiMutation, useRegisterUserApiMutation,useLogoutUserApiMutation,useUpdateUserNameApiMutation,useUpdateUserPasswordApiMutation,useUpdateUserAvatarApiMutation,useGetAllUserApiQuery}  = authApi; 