import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DailyWeatherCard } from '../cards/daily-weather-card'
import { weatherMock } from '@/__mocks__/weather.mock'

describe('DailyWeatherCard', () => {
  it('renders the daily weather elements correctly', () => {
    const daily = weatherMock.weather.daily
    const geo = weatherMock.weather.geo
    const day = daily[0]

    render(<DailyWeatherCard daily={daily} geo={geo} />)

    expect(
      screen.getByText(`Next 8 days weather overview for ${geo.name}`),
    ).toBeInTheDocument()

    expect(screen.getByText('Today')).toBeInTheDocument()

    expect(
      screen.getByText(`${Math.round(day.max)}°`, { exact: false }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(`${Math.round(day.min)}°`, { exact: false }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(`${day.humidity}%`, { exact: false }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(`${Math.round(day.rain)}mm`, { exact: false }),
    ).toBeInTheDocument()

    const windSpeedKmH = Math.round(day.wind_speed * 3.6)
    expect(
      screen.getByText(`${windSpeedKmH}km/h`, { exact: false }),
    ).toBeInTheDocument()
  })
})
