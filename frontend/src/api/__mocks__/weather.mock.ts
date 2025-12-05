export const weatherMock = {
  weather: {
    geo: {
      name: 'city1',
      country: 'country1',
      state: 'state1',
    },
    current: {
      dt: '2025-01-01 10:00:00',
      temp: 25.4,
      feels_like: 26.1,
      humidity: 55,
      wind_speed: 3.2,
      main_weather_status: 'Clouds',
      description: 'scattered clouds',
    },
    daily: [
      {
        dt: '2025-01-01',
        summary: 'Warm day',
        max: 28.0,
        min: 18.5,
        humidity: 50,
        wind_speed: 2.9,
        rain: 0.2,
        pop: 0.1,
        main: 'Clear',
        description: 'clear sky',
      },
    ],
  },
}
