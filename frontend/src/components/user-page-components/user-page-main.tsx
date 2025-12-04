import { useUserStore } from '@/stores/user/user.store'
import { UpdateUserForm } from '../forms/update-user-form'

export function UserPageMain() {
  const name = useUserStore((store) => store.name)
  const email = useUserStore((store) => store.email)
  return (
    <>
      <UpdateUserForm
        name={name ? name : 'name'}
        email={email ? email : 'email'}
      />
    </>
  )
}
