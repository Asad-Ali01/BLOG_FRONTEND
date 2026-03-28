import { useAppSelector } from '@/features/auth/auth.types'
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoute() {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    if(isAuthenticated){
        return <Navigate to="/" replace/>;
    }
  return <Outlet/>
}

export default PublicRoute