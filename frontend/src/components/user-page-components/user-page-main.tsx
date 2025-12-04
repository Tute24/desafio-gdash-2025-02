import { useUserStore } from '@/stores/user/user.store'
import { UpdateUserForm } from '../forms/update-user-form'
import { HydrationSpinner } from '../spinners/hydration-spinner'

export function UserPageMain() {
  const name = useUserStore((store) => store.name)
  const email = useUserStore((store) => store.email)
  const hasHydrated = useUserStore((store) => store.hasHydrated)

  if (!hasHydrated || !name || !email) {
    return (
      <div className="flex justify-center h-screen m-auto">
        <HydrationSpinner />
      </div>
    )
  }

  return (
    <>
      <UpdateUserForm
        name={name ? name : 'name'}
        email={email ? email : 'email'}
      />
    </>
  )
}
