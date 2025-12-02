import { useAuthStore } from '@/stores/auth/auth.store'
import { Navigate, Outlet } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

export function PublicRoute() {
  const token = useAuthStore((s) => s.token)
  const hasHydrated = useAuthStore((s) => s.hasHydrated)

  if (!hasHydrated)
    return (
      <div className="flex flex-col m-auto h-screen justify-center items-center">
        <ClipLoader color="#0e7490" size={150} />
      </div>
    )

  if (token) {
    return <Navigate to="/portal/dashboard" replace />
  }

  return <Outlet />
}
