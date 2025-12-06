import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { weatherMock } from '@/__mocks__/weather.mock'
import { dateSlashParse } from '@/utils/date-slash-parse'
import { TemperatureChart } from '../chart/temperature-chart'

describe('TemperatureChart', () => {
  it('renders title, description, date and mean temperature', () => {
    render(
      <TemperatureChart
        daily={weatherMock.weather.daily}
        geo={weatherMock.weather.geo}
      />,
    )

    const title = `Weather chart for ${weatherMock.weather.geo.name}`
    expect(screen.getByText(title)).toBeInTheDocument()

    expect(
      screen.getByText(/This chart shows the behavior of the/i),
    ).toBeInTheDocument()

    const day = weatherMock.weather.daily[0]
    const formattedDate = dateSlashParse(day.dt.replace('-2025', ''))
    const meanTemp = Math.round((day.max + day.min) / 2)

    expect(screen.getByText(formattedDate!)).toBeInTheDocument()
    expect(screen.getByText(meanTemp, { exact: false })).toBeInTheDocument()
  })
})
