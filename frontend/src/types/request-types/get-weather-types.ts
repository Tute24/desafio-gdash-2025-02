import type { WeatherStoreState } from '../store-types/weather-store-types'

export type WeatherType = {
  weather: WeatherStoreState
}

export type GetWeatherResponse = {
  message: string
  data: WeatherType
}
