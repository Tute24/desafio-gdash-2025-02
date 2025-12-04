import { Button } from '@/components/ui/button'
import { UsersListComponent } from './users-list-component'
import { getUsersRequest } from '@/api/user/get-users-request'
import { LoadingSpinner } from '@/components/spinners/loading-spinner'
import { useState } from 'react'

export interface getUsersProps {
  role: 'admin' | 'user'
}
export function GetUsersComponent({ role }: getUsersProps) {
  const [isLoading, setIsLoading] = useState(false)
  async function getUsersHandler() {
    try {
      setIsLoading(true)
      const response = await getUsersRequest()
      if (!response.success) {
        window.alert(response.message)
      }
    } finally {
      setIsLoading(false)
    }
  }
  if (role === 'admin') {
    return (
      <div className="flex flex-col justify-center gap-3">
        <Button
          variant={'default'}
          onClick={getUsersHandler}
          disabled={isLoading}
          className="text-xl cursor-pointer"
        >
          {isLoading ? <LoadingSpinner /> : 'Get All Users'}
        </Button>
        <UsersListComponent />
      </div>
    )
  }
}
