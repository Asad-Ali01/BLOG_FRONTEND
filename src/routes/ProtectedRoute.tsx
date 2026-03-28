import { useAppSelector } from '@/features/auth/auth.types'
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    if(!isAuthenticated){
        return <Navigate to='/login' replace/>
    }
  return <Outlet/>
}

export default ProtectedRoute