import { useUserStore } from '@/stores/user/user.store'
import { UpdateUserForm } from '../forms/update-user-form'
import { HydrationSpinner } from '../spinners/hydration-spinner'
import { DeleteUserComponent } from './delete-user/delete-user-component'
import { GetUsersComponent } from './get-users/get-users-component'

export function UserPageMain() {
  const name = useUserStore((store) => store.name)
  const email = useUserStore((store) => store.email)
  const hasHydrated = useUserStore((store) => store.hasHydrated)
  const role = useUserStore((store) => store.role)

  if (!hasHydrated || !name || !email) {
    return (
      <div
        className="flex justify-center h-screen m-auto"
        data-testid="hydration-spinner"
      >
        <HydrationSpinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center gap-10 items-center pb-5 px-2">
      <UpdateUserForm
        name={name ? name : 'name'}
        email={email ? email : 'email'}
      />
      <div className="max-w-[420px] min-w-[360px] sm:max-w-[700px] sm:min-w-[450px]">
        <GetUsersComponent role={role} />
      </div>
      <div className="flex flex-col gap-5 justify-center">
        <DeleteUserComponent />
      </div>
    </div>
  )
}
