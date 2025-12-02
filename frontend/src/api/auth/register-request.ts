import type { registerType } from '@/components/forms/register-form'
import { useAuthStore } from '@/stores/auth/auth.store'
import { useUserStore } from '@/stores/user/user.store'
import { AxiosApi } from '../axios-api'
import RequestErrorHandler from '../request-error-handler'
import type { SignInAndRegisterResponse } from '@/types/request-types/sign-in-register-types'
import { useGeneralStore } from '@/stores/general/general.store'

export async function registerRequest(registerData: registerType) {
  const { setToken } = useAuthStore.getState()
  const { setId, setName, setEmail } = useUserStore.getState()
  const { setIsLoading } = useGeneralStore.getState()

  try {
    setIsLoading(true)
    const response = await AxiosApi({
      httpMethod: 'post',
      route: '/auth/create-user',
      data: registerData,
    })

    if (response.status === 201) {
      const responseData = response.data as SignInAndRegisterResponse
      setToken(responseData.token)
      setId(responseData.user.id)
      setName(responseData.user.name)
      setEmail(responseData.user.email)
      console.log(responseData.message)
      return { success: true }
    }

    return { success: false }
  } catch (error) {
    RequestErrorHandler(error)
    return { success: false }
  } finally {
    setIsLoading(false)
  }
}
