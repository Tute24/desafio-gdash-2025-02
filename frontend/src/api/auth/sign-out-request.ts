import { AxiosApi } from '../axios-api'
import RequestErrorHandler from '../request-error-handler'
import { useAuthStore } from '@/stores/auth/auth.store'
import { useUserStore } from '@/stores/user/user.store'
import { useGeneralStore } from '@/stores/general/general.store'

export async function signOutRequest() {
  const { setToken } = useAuthStore.getState()
  const { setId, setName, setEmail } = useUserStore.getState()
  const { setIsLoading } = useGeneralStore.getState()
  try {
    setIsLoading(true)
    const response = await AxiosApi({
      httpMethod: 'post',
      route: '/auth/sign-out',
    })

    if (response.status === 201) {
      const responseData = response.data as { message: string }
      setToken(null)
      setId(null)
      setName(null)
      setEmail(null)
      console.log(responseData.message)
      return { success: true }
    }

    return { success: false }
  } catch (error) {
    RequestErrorHandler({ error })
    return { success: false }
  } finally {
    setIsLoading(false)
  }
}
