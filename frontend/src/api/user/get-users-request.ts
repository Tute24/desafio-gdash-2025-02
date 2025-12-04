import { AxiosApi } from '../axios-api'
import RequestErrorHandler from '../request-error-handler'
import type { getUsersResponse } from '@/types/request-types/user-types'
import { useUserStore } from '@/stores/user/user.store'

export async function getUsersRequest() {
  const { setUsers } = useUserStore.getState()
  try {
    const response = await AxiosApi({
      httpMethod: 'get',
      route: '/users/get',
    })

    if (response.status === 200) {
      const responseData = response.data as getUsersResponse
      setUsers(responseData.users)
      console.log(responseData.message)
      return { success: true }
    }

    return { success: false, message: `Couldn't fetch the users.` }
  } catch (error) {
    RequestErrorHandler({ error })
    return { success: false }
  }
}
