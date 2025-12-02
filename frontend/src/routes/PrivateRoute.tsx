import { useAuthStore } from '@/stores/auth/auth.store'
import { Navigate, Outlet } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

export function PrivateRoute() {
  const token = useAuthStore((store) => store.token)
  const hasHydrated = useAuthStore((store) => store.hasHydrated)

  if (!hasHydrated) {
    return (
      <div className="flex flex-col m-auto h-screen justify-center items-center">
        <ClipLoader color="#0e7490" size={150} />
      </div>
    )
  }

  if (hasHydrated && !token) {
    return <Navigate to="/" replace />
  } else {
    if (
      window.location.pathname === '/' ||
      window.location.pathname.startsWith('/register')
    ) {
      return <Navigate to="/portal/dashboard" replace />
    }
    return <Outlet />
  }
}
