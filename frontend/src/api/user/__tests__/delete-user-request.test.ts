import { describe, it, expect, vi, type Mock } from 'vitest'

import { deleteUserRequest } from '@/api/user/delete-user-request'
import { AxiosApi } from '@/api/axios-api'
import RequestErrorHandler from '@/api/request-error-handler'

import { useGeneralStore } from '@/stores/general/general.store'
import { useWeatherStore } from '@/stores/weather/weather.store'
import { useUserStore } from '@/stores/user/user.store'
import { useAuthStore } from '@/stores/auth/auth.store'

vi.mock('@/api/axios-api')
vi.mock('@/api/request-error-handler')
vi.mock('@/stores/general/general.store')
vi.mock('@/stores/weather/weather.store')
vi.mock('@/stores/user/user.store')
vi.mock('@/stores/auth/auth.store')

const mockUseGeneralStore = useGeneralStore.getState as unknown as Mock
const mockUseWeatherStore = useWeatherStore.getState as unknown as Mock
const mockUseUserStore = useUserStore.getState as unknown as Mock
const mockUseAuthStore = useAuthStore.getState as unknown as Mock

const mockAxiosApi = AxiosApi as unknown as Mock
const mockRequestErrorHandler = RequestErrorHandler as unknown as Mock

describe('deleteUserRequest', () => {
  it('should handle successfull request', async () => {
    const mockResetGeneral = vi.fn()
    const mockResetWeather = vi.fn()
    const mockResetUser = vi.fn()
    const mockSetToken = vi.fn()

    mockUseGeneralStore.mockReturnValue({ reset: mockResetGeneral })
    mockUseWeatherStore.mockReturnValue({ reset: mockResetWeather })
    mockUseUserStore.mockReturnValue({ reset: mockResetUser })
    mockUseAuthStore.mockReturnValue({ setToken: mockSetToken })

    mockAxiosApi.mockResolvedValueOnce({
      status: 200,
      data: { message: 'User deleted.' },
    })

    const response = await deleteUserRequest()

    expect(mockAxiosApi).toHaveBeenCalledWith({
      httpMethod: 'delete',
      route: '/users/delete',
    })

    expect(mockSetToken).toHaveBeenCalledWith(null)
    expect(mockResetGeneral).toHaveBeenCalled()
    expect(mockResetWeather).toHaveBeenCalled()
    expect(mockResetUser).toHaveBeenCalled()

    expect(response.success).toBe(true)
    expect(response.message).toBe('User deleted.')
  })

  it('should return success false when status is not 200', async () => {
    const mockResetGeneral = vi.fn()
    const mockResetWeather = vi.fn()
    const mockResetUser = vi.fn()
    const mockSetToken = vi.fn()

    mockUseGeneralStore.mockReturnValue({ reset: mockResetGeneral })
    mockUseWeatherStore.mockReturnValue({ reset: mockResetWeather })
    mockUseUserStore.mockReturnValue({ reset: mockResetUser })
    mockUseAuthStore.mockReturnValue({ setToken: mockSetToken })

    mockAxiosApi.mockResolvedValueOnce({
      status: 500,
      data: {},
    })

    const response = await deleteUserRequest()

    expect(mockSetToken).not.toHaveBeenCalled()
    expect(mockResetGeneral).not.toHaveBeenCalled()
    expect(mockResetWeather).not.toHaveBeenCalled()
    expect(mockResetUser).not.toHaveBeenCalled()

    expect(response.success).toBe(false)
  })

  it('should call RequestErrorHandler on error', async () => {
    const mockResetGeneral = vi.fn()
    const mockResetWeather = vi.fn()
    const mockResetUser = vi.fn()
    const mockSetToken = vi.fn()

    mockUseGeneralStore.mockReturnValue({ reset: mockResetGeneral })
    mockUseWeatherStore.mockReturnValue({ reset: mockResetWeather })
    mockUseUserStore.mockReturnValue({ reset: mockResetUser })
    mockUseAuthStore.mockReturnValue({ setToken: mockSetToken })

    const err = new Error('delete failed')
    mockAxiosApi.mockRejectedValueOnce(err)

    const response = await deleteUserRequest()

    expect(mockRequestErrorHandler).toHaveBeenCalledWith({ error: err })

    expect(mockSetToken).not.toHaveBeenCalled()
    expect(mockResetGeneral).not.toHaveBeenCalled()
    expect(mockResetWeather).not.toHaveBeenCalled()
    expect(mockResetUser).not.toHaveBeenCalled()

    expect(response.success).toBe(false)
  })
})
