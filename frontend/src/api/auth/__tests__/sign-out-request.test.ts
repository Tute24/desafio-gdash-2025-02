import { describe, it, expect, vi, type Mock } from 'vitest'

import { signOutRequest } from '@/api/auth/sign-out-request'
import { AxiosApi } from '@/api/axios-api'
import RequestErrorHandler from '@/api/request-error-handler'

import { useAuthStore } from '@/stores/auth/auth.store'
import { useUserStore } from '@/stores/user/user.store'
import { useGeneralStore } from '@/stores/general/general.store'
import { useWeatherStore } from '@/stores/weather/weather.store'

vi.mock('@/api/axios-api')
vi.mock('@/api/request-error-handler')
vi.mock('@/stores/auth/auth.store')
vi.mock('@/stores/user/user.store')
vi.mock('@/stores/general/general.store')
vi.mock('@/stores/weather/weather.store')

const mockUseAuthStoreGetState = useAuthStore.getState as unknown as Mock
const mockUseUserStoreGetState = useUserStore.getState as unknown as Mock
const mockUseGeneralStoreGetState = useGeneralStore.getState as unknown as Mock
const mockUseWeatherStoreGetState = useWeatherStore.getState as unknown as Mock

const mockAxiosApi = AxiosApi as Mock
const mockRequestErrorHandler = RequestErrorHandler as Mock

describe('signOutRequest', () => {
  it('should handle successfull request', async () => {
    const mockSetToken = vi.fn()
    const mockResetUser = vi.fn()
    const mockResetGeneral = vi.fn()
    const mockResetWeather = vi.fn()

    mockUseAuthStoreGetState.mockReturnValue({
      setToken: mockSetToken,
    })

    mockUseUserStoreGetState.mockReturnValue({
      reset: mockResetUser,
    })

    mockUseGeneralStoreGetState.mockReturnValue({
      reset: mockResetGeneral,
    })

    mockUseWeatherStoreGetState.mockReturnValue({
      reset: mockResetWeather,
    })

    mockAxiosApi.mockResolvedValueOnce({
      status: 201,
      data: { message: 'Successfully signed out.' },
    })

    const response = await signOutRequest()

    expect(mockAxiosApi).toHaveBeenCalledWith({
      httpMethod: 'post',
      route: '/auth/sign-out',
    })

    expect(mockSetToken).toHaveBeenCalledWith(null)
    expect(mockResetUser).toHaveBeenCalled()
    expect(mockResetWeather).toHaveBeenCalled()
    expect(mockResetGeneral).toHaveBeenCalled()

    expect(response.success).toBe(true)
    expect(response.message).toBe('Successfully signed out.')
  })

  it('should return success false when status is not 201', async () => {
    const mockSetToken = vi.fn()

    mockUseAuthStoreGetState.mockReturnValue({
      setToken: mockSetToken,
    })

    mockUseUserStoreGetState.mockReturnValue({
      reset: vi.fn(),
    })

    mockUseGeneralStoreGetState.mockReturnValue({
      reset: vi.fn(),
    })

    mockUseWeatherStoreGetState.mockReturnValue({
      reset: vi.fn(),
    })

    mockAxiosApi.mockResolvedValueOnce({
      status: 400,
    })

    const response = await signOutRequest()

    expect(response.success).toBe(false)
  })

  it('should call RequestErrorHandler on API error', async () => {
    const error = new Error('API failed')

    mockUseAuthStoreGetState.mockReturnValue({
      setToken: vi.fn(),
    })

    mockUseUserStoreGetState.mockReturnValue({
      reset: vi.fn(),
    })

    mockUseGeneralStoreGetState.mockReturnValue({
      reset: vi.fn(),
    })

    mockUseWeatherStoreGetState.mockReturnValue({
      reset: vi.fn(),
    })

    mockAxiosApi.mockRejectedValueOnce(error)

    const response = await signOutRequest()

    expect(mockRequestErrorHandler).toHaveBeenCalledWith({ error })
    expect(response.success).toBe(false)
  })
})
