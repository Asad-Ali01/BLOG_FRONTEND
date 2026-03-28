import { baseQueryWithReauth } from "@/api/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import type{ GetAllUsersResponse, IUser } from "../auth/auth.types";
import type { EditUserByAdmin, GetUserInfoResponse } from "./admin.types";
import { blogApi } from "../blog/blogApi";


export const adminApi = createApi({
    reducerPath:"adminApi",
    baseQuery:baseQueryWithReauth,
    tagTypes:["users"],
    endpoints:(builder) => ({
        getUserApi: builder.query<GetAllUsersResponse,{cursor:string | null,search:string;}>({
            query: ({cursor,search}) => ({
                url:`/admin/users?cursor=${cursor}&limit=4&search=${search}`,
                method:"GET",
            }),
            providesTags:["users"]
        }),
        deleteUserApi: builder.mutation<{message:string;},{_id:string}>({
            query:({_id}) => ({
                url:`/admin/delete-user/${_id}`,
                method:"POST"
            }),
            invalidatesTags:["users"],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(blogApi.util.invalidateTags(["Blogs"]));
                } catch {
                    // If delete fails, don't invalidate cache.
                }
            }
        }),
        getUserInfo: builder.query<GetUserInfoResponse,{_id:string}>({
            query:({_id}) => ({
                url:`admin/get-user-info/${_id}`,
                method:"GET"
            })
        }),
        editUserApi: builder.mutation<IUser,EditUserByAdmin>({
            query:({_id,username,role}) => ({
                url:`/admin/edit-user/${_id}`,
                method:"PATCH",
                body:{username,role}
            }),
            invalidatesTags:["users"]
        }),
        editUserAvatar: builder.mutation<IUser,{_id:string,form:FormData}>({
            query:(({_id,form}) => ({
                url:`/admin/change-avatar/${_id}`,
                method:"PATCH",
                body:form
            })),
            invalidatesTags:["users"]
        })
    })
})
export const {useGetUserApiQuery,useDeleteUserApiMutation,useEditUserApiMutation,useGetUserInfoQuery,useEditUserAvatarMutation} = adminApi