import { AxiosApi } from '../axios-api'
import RequestErrorHandler from '../request-error-handler'
import { useAuthStore } from '@/stores/auth/auth.store'
import { useUserStore } from '@/stores/user/user.store'
import type { SignInRegisterUpdateResponse } from '@/types/request-types/sign-in-register-update-types'
import { useGeneralStore } from '@/stores/general/general.store'
import type { updateUserType } from '@/components/forms/update-user-form'

export async function updateUserRequest(updateUserData: updateUserType) {
  const { setToken } = useAuthStore.getState()
  const { setName, setEmail } = useUserStore.getState()
  const { setIsLoading, setStatusMessage } = useGeneralStore.getState()
  try {
    setIsLoading(true)
    const dataToSend = {
      email: updateUserData.email,
      name: updateUserData.name,
      ...(updateUserData.passwordUpdate?.password && {
        password: updateUserData.passwordUpdate.password,
        confirmPassword: updateUserData.passwordUpdate.confirmPassword,
      }),
    }

    const response = await AxiosApi({
      httpMethod: 'post',
      route: '/users/update',
      data: dataToSend,
    })

    if (response.status === 201) {
      const responseData = response.data as SignInRegisterUpdateResponse
      setToken(responseData.token)
      setName(responseData.user.name)
      setEmail(responseData.user.email)
      console.log(responseData.message)
      setStatusMessage('')
      return { success: true, updatedUser: responseData.user }
    }

    return { success: false }
  } catch (error) {
    RequestErrorHandler({ error, setStatusMessage })
    return { success: false }
  } finally {
    setIsLoading(false)
  }
}
