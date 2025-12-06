import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { toTitleCase } from '@/utils/to-title-case'
import { CurrentWeatherCard } from '../cards/current-weather-card'
import { weatherMock } from '@/__mocks__/weather.mock'

describe('CurrentWeatherCard', () => {
  it('renders the main weather elements correctly', () => {
    render(
      <CurrentWeatherCard
        current={weatherMock.weather.current}
        geo={weatherMock.weather.geo}
      />,
    )

    expect(
      screen.getByText(`Current weather in ${weatherMock.weather.geo.name}`),
    ).toBeInTheDocument()

    expect(
      screen.getByText(`${Math.round(weatherMock.weather.current.temp)}°`),
    ).toBeInTheDocument()
    const description = toTitleCase(weatherMock.weather.current.description)
    expect(screen.getByText(description!)).toBeInTheDocument()

    expect(
      screen.getByText(
        `${Math.round(weatherMock.weather.current.feels_like)}°`,
        { exact: false },
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(`${weatherMock.weather.current.humidity}%`, {
        exact: false,
      }),
    ).toBeInTheDocument()

    const windSpeed = Math.round(weatherMock.weather.current.wind_speed * 3.6)
    expect(
      screen.getByText(`${windSpeed}km/h`, { exact: false }),
    ).toBeInTheDocument()
  })
})
