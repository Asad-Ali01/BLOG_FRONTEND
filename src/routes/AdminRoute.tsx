import { useAppSelector } from "@/features/auth/auth.types"
import { Navigate, Outlet } from "react-router-dom"
function AdminRoute() {
    const user = useAppSelector(state => state.auth.user)
  if(!user){
    return <Navigate to="/login" replace/>
  }

  if(user.role !== "admin"){
    return <Navigate to="/" replace/>
  }
  return <Outlet/>
}

export default AdminRoute;