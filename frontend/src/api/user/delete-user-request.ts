import RequestErrorHandler from '../request-error-handler'
import { useGeneralStore } from '@/stores/general/general.store'
import { AxiosApi } from '../axios-api'
import { useAuthStore } from '@/stores/auth/auth.store'
import { useWeatherStore } from '@/stores/weather/weather.store'
import { useUserStore } from '@/stores/user/user.store'

export async function deleteUserRequest() {
  const resetGeneral = useGeneralStore.getState().reset
  const resetWeather = useWeatherStore.getState().reset
  const resetUser = useUserStore.getState().reset
  const { setToken } = useAuthStore.getState()
  try {
    const response = await AxiosApi({
      httpMethod: 'delete',
      route: '/users/delete',
    })

    if (response.status === 200) {
      const responseData = response.data as { message: string }
      setToken(null)
      resetGeneral()
      resetWeather()
      resetUser()
      return { success: true, message: responseData.message }
    }

    return { success: false }
  } catch (error) {
    RequestErrorHandler({ error })
    return {
      success: false,
    }
  }
}
