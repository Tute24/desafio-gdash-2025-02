import { useUserStore } from '@/stores/user/user.store'
import { UpdateUserForm } from '../forms/update-user-form'
import { HydrationSpinner } from '../spinners/hydration-spinner'
import { DeleteUserComponent } from './delete-user/delete-user-component'

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
    <div className="grid sm:grid-cols-2 gap-10 justify-center items-center text-center pb-5 px-4">
      <UpdateUserForm
        name={name ? name : 'name'}
        email={email ? email : 'email'}
      />
      <DeleteUserComponent />
    </div>
  )
}
