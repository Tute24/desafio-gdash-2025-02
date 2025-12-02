import RegisterForm from '@/components/forms/register-form'
import UnLoggedHeader from '@/components/headers/unlogged-header'

export default function RegisterPage() {
  return (
    <div>
      <UnLoggedHeader />
      <RegisterForm />
    </div>
  )
}
