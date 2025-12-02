import RegisterPage from '@/pages/auth/register/Register'
import SignInPage from '@/pages/auth/sign-in/SignIn'
import { createBrowserRouter } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import DashboardPage from '@/pages/weather/dashboard/Dashboard'
import { PublicRoute } from './PublicRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      {
        path: '/',
        element: <SignInPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },

  {
    path: '/portal',
    element: <PrivateRoute />,
    children: [{ path: 'dashboard', element: <DashboardPage /> }],
  },
])
