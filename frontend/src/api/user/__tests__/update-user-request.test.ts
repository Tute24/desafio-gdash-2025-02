import { describe, it, expect, vi, type Mock } from 'vitest'

import { updateUserRequest } from '@/api/user/update-user-request'
import { AxiosApi } from '@/api/axios-api'
import RequestErrorHandler from '@/api/request-error-handler'

import { useAuthStore } from '@/stores/auth/auth.store'
import { useUserStore } from '@/stores/user/user.store'
import { useGeneralStore } from '@/stores/general/general.store'
import { userMock } from '@/api/__mocks__/user.mock'

vi.mock('@/api/axios-api')
vi.mock('@/api/request-error-handler')
vi.mock('@/stores/auth/auth.store')
vi.mock('@/stores/user/user.store')
vi.mock('@/stores/general/general.store')

const mockUseAuthStore = useAuthStore.getState as unknown as Mock
const mockUseUserStore = useUserStore.getState as unknown as Mock
const mockUseGeneralStore = useGeneralStore.getState as unknown as Mock

const mockAxiosApi = AxiosApi as unknown as Mock
const mockRequestErrorHandler = RequestErrorHandler as unknown as Mock

describe('updateUserRequest', () => {
  it('should handle successfull request', async () => {
    const mockSetToken = vi.fn()
    const mockSetName = vi.fn()
    const mockSetEmail = vi.fn()
    const mockSetIsLoading = vi.fn()
    const mockSetStatusMessage = vi.fn()

    mockUseAuthStore.mockReturnValue({ setToken: mockSetToken })
    mockUseUserStore.mockReturnValue({
      setName: mockSetName,
      setEmail: mockSetEmail,
    })
    mockUseGeneralStore.mockReturnValue({
      setIsLoading: mockSetIsLoading,
      setStatusMessage: mockSetStatusMessage,
    })
    const returnData = {
      message: 'User updated',
      token: userMock.token,
      user: {
        id: userMock.id,
        name: userMock.name,
        email: userMock.email,
        role: 'admin',
      },
    }
    mockAxiosApi.mockResolvedValueOnce({
      status: 201,
      data: returnData,
    })

    const payload = {
      name: userMock.name,
      email: userMock.email,
      passwordUpdate: {
        password: userMock.password,
        confirmPassword: userMock.password,
      },
    }

    const response = await updateUserRequest(payload)

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(1, true)

    expect(mockAxiosApi).toHaveBeenCalledWith({
      httpMethod: 'post',
      route: '/users/update',
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.passwordUpdate.password,
        confirmPassword: payload.passwordUpdate.confirmPassword,
      },
    })

    expect(mockSetToken).toHaveBeenCalledWith(userMock.token)
    expect(mockSetName).toHaveBeenCalledWith(userMock.name)
    expect(mockSetEmail).toHaveBeenCalledWith(userMock.email)
    expect(mockSetStatusMessage).toHaveBeenCalledWith('')

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(2, false)
    expect(response.success).toBe(true)
  })

  it('should return success false when status is not 201', async () => {
    const mockSetIsLoading = vi.fn()

    mockUseAuthStore.mockReturnValue({ setToken: vi.fn() })
    mockUseUserStore.mockReturnValue({ setName: vi.fn(), setEmail: vi.fn() })
    mockUseGeneralStore.mockReturnValue({
      setIsLoading: mockSetIsLoading,
      setStatusMessage: vi.fn(),
    })

    mockAxiosApi.mockResolvedValueOnce({
      status: 400,
      data: {},
    })

    const response = await updateUserRequest({
      name: 'X',
      email: 'X',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    expect(response.success).toBe(false)
    expect(mockSetIsLoading).toHaveBeenNthCalledWith(2, false)
  })

  it('should call RequestErrorHandler on API error', async () => {
    const mockSetIsLoading = vi.fn()
    const mockSetStatusMessage = vi.fn()

    mockUseAuthStore.mockReturnValue({ setToken: vi.fn() })
    mockUseUserStore.mockReturnValue({ setName: vi.fn(), setEmail: vi.fn() })
    mockUseGeneralStore.mockReturnValue({
      setIsLoading: mockSetIsLoading,
      setStatusMessage: mockSetStatusMessage,
    })

    const err = new Error('API failed')
    mockAxiosApi.mockRejectedValueOnce(err)

    const response = await updateUserRequest({
      name: 'Test',
      email: 'test',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    expect(mockRequestErrorHandler).toHaveBeenCalledWith({
      error: err,
      setStatusMessage: mockSetStatusMessage,
    })

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(2, false)
    expect(response.success).toBe(false)
  })
})
