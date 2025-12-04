import { AxiosApi } from '../axios-api'
import RequestErrorHandler from '../request-error-handler'
import { useAuthStore } from '@/stores/auth/auth.store'
import { useUserStore } from '@/stores/user/user.store'
import { useGeneralStore } from '@/stores/general/general.store'
import { useWeatherStore } from '@/stores/weather/weather.store'

export async function signOutRequest() {
  const { setToken } = useAuthStore.getState()
  const resetUser = useUserStore.getState().reset
  const resetGeneral = useGeneralStore.getState().reset
  const resetWeather = useWeatherStore.getState().reset
  try {
    const response = await AxiosApi({
      httpMethod: 'post',
      route: '/auth/sign-out',
    })

    if (response.status === 201) {
      const responseData = response.data as { message: string }
      setToken(null)
      resetUser()
      resetWeather()
      resetGeneral()
      console.log(responseData.message)
      return { success: true, message: responseData.message }
    }

    return { success: false }
  } catch (error) {
    RequestErrorHandler({ error })
    return { success: false }
  }
}
