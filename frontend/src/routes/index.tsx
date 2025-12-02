import RegisterPage from '@/pages/auth/register/Register'
import SignInPage from '@/pages/auth/sign-in/SignIn'
import { Route, Routes } from 'react-router-dom'

export function Router() {
  return (
    <Routes>
      <Route index element={<SignInPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}
