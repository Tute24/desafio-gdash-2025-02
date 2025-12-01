export type geoType = {
  name: string | null
  country: string | null
  state: string | null
}

export type dailyWeatherType = {
  dt: string | null
  summary: string | null
  max: number | null
  min: number | null
  humidity: number | null
  wind_speed: number | null
  rain: number | null
  pop: number | null
  main: string | null
  description: string | null
}

export type currentWeatherType = {
  dt: string | null
  temp: number | null
  feels_like: number | null
  humidity: number | null
  wind_speed: number | null
  main_weather_status: string | null
  description: string | null
}

export type WeatherStoreState = {
  currentWeather: currentWeatherType | null
  dailyWeather: dailyWeatherType[]
  geo: geoType | null
  hasHydrated: boolean
}

export type WeatherStoreAction = {
  setCurrentWeather: (currentWeather: currentWeatherType | null) => void
  setDailyWeather: (dailyWeather: dailyWeatherType[]) => void
  setGeo: (geo: geoType | null) => void
}

export type Weatherstore = WeatherStoreState & WeatherStoreAction
