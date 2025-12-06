import { describe, it, expect, type Mock, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardMain from '../dashboard-main'

import { weatherMock } from '@/__mocks__/weather.mock'
import { dateSlashParse } from '@/utils/date-slash-parse'
import { useWeatherStore } from '@/stores/weather/weather.store'

vi.mock('@/stores/weather/weather.store')

const mockUseWeatherStore = useWeatherStore as unknown as Mock
describe('DashboardMain', () => {
  it('renders the page with the correct data', () => {
    const current = weatherMock.weather.current
    const geo = weatherMock.weather.geo
    const daily = weatherMock.weather.daily

    mockUseWeatherStore.mockImplementation((selector) =>
      selector({
        current,
        geo,
        daily,
        hasHydrated: true,
      }),
    )

    render(<DashboardMain />)

    const formattedDate = dateSlashParse(current.dt)
    const expectedText = `${formattedDate}`

    expect(screen.getByText(expectedText)).toBeInTheDocument()
  })

  it('renders the hydration spinner when not hydrated', () => {
    mockUseWeatherStore.mockImplementation((selector) =>
      selector({
        current: null,
        geo: null,
        daily: [],
        hasHydrated: false,
      }),
    )

    render(<DashboardMain />)

    expect(screen.getByTestId('hydration-spinner')).toBeInTheDocument()
  })
})
