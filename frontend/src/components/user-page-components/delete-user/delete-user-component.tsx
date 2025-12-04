import { deleteUserRequest } from '@/api/user/delete-user-request'
import { ModalComponent } from '@/components/modal/modal'
import { Button } from '@/components/ui/button'
import { FolderX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function DeleteUserComponent() {
  const navigate = useNavigate()
  async function deleteUserHandler() {
    const response = await deleteUserRequest()
    if (response?.success) {
      window.alert(response.message)
      navigate('/', { replace: true })
    } else {
      window.alert(`Couldn't delete the user.`)
    }
  }
  return (
    <div className="flex flex-col gap-5 max-w-[300px] border-2 rounded-2xl border-cyan-200 ml-5 py-5 sm:px-2 font-inter text-center">
      <h2 className="text-xs sm:text-sm font-semibold">
        You can delete your user{' '}
        <span className="font-bold text-red-600">permanently</span> by <br />{' '}
        click on the button below.
      </h2>
      <div className="flex flex-row gap-3 justify-center">
        <div>
          <ModalComponent
            guideText="Delete your user"
            dialogText="Delete user"
            requestHandler={deleteUserHandler}
            buttonLayout={
              <Button variant={'destructive'} className="cursor-pointer">
                <FolderX className="text-white" size={30} />
                <div className="text-white font-semibold text-lg">
                  Delete User
                </div>
              </Button>
            }
          />
        </div>
      </div>
    </div>
  )
}
