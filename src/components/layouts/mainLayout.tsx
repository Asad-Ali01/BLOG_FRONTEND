import { Outlet } from 'react-router-dom'
import Header from './header'
import { useAppSelector } from '@/features/auth/auth.types'
import Layout from './Layout';

function MainLayout() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <div className='absolute w-full h-full left-0 top-0'>
      {isAuthenticated ? (
        <Layout>
          <Outlet />
        </Layout>
      ) : (
        <div className='h-[calc(100%-40px)] '>
          <div className='h-20 sticky top-0'>
            <Header />
          </div>
          <div className='h-[90%] overflow-auto'>
            <Outlet />
          </div>
        </div>
      )}
    </div>
  )
}

export default MainLayout