import { describe, it, expect, vi, type Mock } from 'vitest'

import { getWeatherRequest } from '@/api/weather/get-weather-request'
import { AxiosApi } from '@/api/axios-api'
import RequestErrorHandler from '@/api/request-error-handler'

import { useGeneralStore } from '@/stores/general/general.store'
import { useWeatherStore } from '@/stores/weather/weather.store'

import { weatherMock } from '@/__mocks__/weather.mock'

vi.mock('@/api/axios-api')
vi.mock('@/api/request-error-handler')
vi.mock('@/stores/general/general.store')
vi.mock('@/stores/weather/weather.store')

const mockUseGeneralStore = useGeneralStore.getState as unknown as Mock
const mockUseWeatherStore = useWeatherStore.getState as unknown as Mock

const mockAxiosApi = AxiosApi as Mock
const mockRequestErrorHandler = RequestErrorHandler as Mock

describe('getWeatherRequest', () => {
  it('should handle successfull request', async () => {
    const mockSetIsLoading = vi.fn()
    const mockSetCurrent = vi.fn()
    const mockSetDaily = vi.fn()
    const mockSetGeo = vi.fn()

    mockUseGeneralStore.mockReturnValue({
      setIsLoading: mockSetIsLoading,
    })

    mockUseWeatherStore.mockReturnValue({
      setCurrent: mockSetCurrent,
      setDaily: mockSetDaily,
      setGeo: mockSetGeo,
    })

    mockAxiosApi.mockResolvedValueOnce({
      status: 200,
      data: {
        message: 'Weather fetched successfully',
        data: {
          weather: weatherMock.weather,
        },
      },
    })

    const response = await getWeatherRequest()

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(1, true)

    expect(mockAxiosApi).toHaveBeenCalledWith({
      httpMethod: 'get',
      route: '/weather/get',
    })

    expect(mockSetCurrent).toHaveBeenCalledWith(weatherMock.weather.current)
    expect(mockSetDaily).toHaveBeenCalledWith(weatherMock.weather.daily)
    expect(mockSetGeo).toHaveBeenCalledWith(weatherMock.weather.geo)

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(2, false)
    expect(response.success).toBe(true)
  })

  it('should call RequestErrorHandler on API error', async () => {
    const mockSetIsLoading = vi.fn()

    mockUseGeneralStore.mockReturnValue({
      setIsLoading: mockSetIsLoading,
    })

    mockUseWeatherStore.mockReturnValue({
      setCurrent: vi.fn(),
      setDaily: vi.fn(),
      setGeo: vi.fn(),
    })

    const err = new Error('API failed')
    mockAxiosApi.mockRejectedValueOnce(err)

    const response = await getWeatherRequest()

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(1, true)

    expect(mockRequestErrorHandler).toHaveBeenCalledWith({ error: err })

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(2, false)
    expect(response.success).toBe(false)
  })
})
