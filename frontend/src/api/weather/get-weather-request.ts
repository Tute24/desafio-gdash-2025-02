import { useGeneralStore } from '@/stores/general/general.store'
import { AxiosApi } from '../axios-api'
import RequestErrorHandler from '../request-error-handler'
import type { GetWeatherResponse } from '@/types/request-types/get-weather-types'
import { useWeatherStore } from '@/stores/weather/weather.store'

export async function getWeatherRequest() {
  const { setIsLoading } = useGeneralStore.getState()
  const { setCurrent, setDaily, setGeo } = useWeatherStore.getState()
  try {
    setIsLoading(true)
    const response = await AxiosApi({
      httpMethod: 'get',
      route: '/weather/get',
    })

    if (response.status === 200) {
      const responseData = response.data as GetWeatherResponse
      console.log(responseData.message, console.log(responseData.data.weather))
      setCurrent(responseData.data.weather.current)
      setDaily(responseData.data.weather.daily)
      setGeo(responseData.data.weather.geo)
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
