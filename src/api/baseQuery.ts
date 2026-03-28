import type { IUser } from "@/features/auth/auth.types";
import { rawBaseQuery, authApi } from "@/features/auth/authApi";
import type { BaseQueryApi, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout, register } from "@/features/auth/auth";

type BaseQueryFn<Args = any,DefinitionExtraOptions = {},Result = unknown,Error = unknown> = (args: Args,api: BaseQueryApi,extraOptions: DefinitionExtraOptions,
) => Promise<{ data: Result } | { error: Error }>;



export const baseQueryWithReauth: BaseQueryFn<
Parameters<typeof rawBaseQuery>[0],
{},
any,
FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  if ((result.error as FetchBaseQueryError)?.status === 401) {
    const refreshResult = await rawBaseQuery(
      {
        url: "/users/refresh-token",
        method: "POST",
      },
      api,
      extraOptions,
    )
    
    if (refreshResult.data) {
      const data = refreshResult.data as {
        data: {
          user: IUser;
          accessToken: string;
        };
      };
      api.dispatch(
        register({
          user: data.data.user,
          accessToken: data.data.accessToken,
        }),
      );

      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      api.dispatch(authApi.util.resetApiState());
    }
  }

  return result;
};
