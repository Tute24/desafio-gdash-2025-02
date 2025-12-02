import SignInForm from '@/components/forms/sign-in-form'
import UnLoggedHeader from '@/components/headers/unlogged-header'

export default function SignInPage() {
  return (
    <div>
      <UnLoggedHeader />
      <SignInForm />
    </div>
  )
}
