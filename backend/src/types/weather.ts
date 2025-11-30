export type CurrentWeather = {
  dt: string;
  temp?: number;
  feels_like?: number;
  humidity?: number;
  wind_speed?: number;
  main_weather_status?: string;
  description?: string;
};

export type DailyForecast = {
  dt: string;
  summary?: string;
  max?: number;
  min?: number;
  humidity?: number;
  wind_speed?: number;
  rain?: number;
  pop?: number;
  main?: string;
  description?: string;
};

export type GeoInfo = {
  name: string;
  country: string;
  state: string;
};

export type WeatherData = {
  current: CurrentWeather;
  daily: DailyForecast[];
  geo: GeoInfo;
};

export type WeatherType = {
  weather: WeatherData;
};
