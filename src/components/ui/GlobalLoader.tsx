import { useAppSelector } from "@/features/auth/auth.types";
import { Spin } from "antd";
export const GlobalLoader = () => {
  const adminQueries = useAppSelector((state) => state.adminApi.queries)
  const adminMutation = useAppSelector((state) => state.adminApi.mutations)

  const blogQueries = useAppSelector((state) => state.blogApi.queries);
  const blogMutation = useAppSelector((state) => state.blogApi.mutations)

  const authQueries = useAppSelector((state) => state.authApi.queries)
  const authMutation = useAppSelector((state) => state.authApi.mutations)

  const isFetching = 
  Object.values(adminQueries || {}).some((q) => q?.status === "pending") ||
  Object.values(adminMutation || {}).some((q) => q?.status === "pending") ||
  Object.values(blogQueries || {}).some((q) => q?.status === "pending") ||
  Object.values(blogMutation || {}).some((q) => q?.status === "pending") ||
  Object.values(authQueries || {}).some((q) => q?.status === "pending") ||
  Object.values(authMutation || {}).some((q) => q?.status === "pending");


  return isFetching ? <div className="h-screen z-1000 relative grid place-items-center">
    <Spin size="large"/>
  </div>  : null;
};