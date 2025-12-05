import { describe, it, expect, vi, type Mock } from 'vitest'

import { AxiosApi } from '@/api/axios-api'
import RequestErrorHandler from '@/api/request-error-handler'

import { useAuthStore } from '@/stores/auth/auth.store'
import { useUserStore } from '@/stores/user/user.store'

import { signInRequest } from '@/api/auth/sign-in-request'
import { userMock } from '@/__mocks__/user.mock'
import { useGeneralStore } from '@/stores/general/general.store'

vi.mock('@/api/axios-api')
vi.mock('@/api/request-error-handler')
vi.mock('@/stores/auth/auth.store')
vi.mock('@/stores/user/user.store')
vi.mock('@/stores/general/general.store')

const mockUseAuthStoreGetState = useAuthStore.getState as unknown as Mock
const mockUseUserStoreGetState = useUserStore.getState as unknown as Mock
const mockUseGeneralStoreGetState = useGeneralStore.getState as unknown as Mock

const mockAxiosApi = AxiosApi as Mock
const mockRequestErrorHandler = RequestErrorHandler as Mock

describe('signInRequest', () => {
  it('should handle successfull request', async () => {
    const mockSetToken = vi.fn()
    const mockSetId = vi.fn()
    const mockSetName = vi.fn()
    const mockSetEmail = vi.fn()
    const mockSetRole = vi.fn()

    const mockSetIsLoading = vi.fn()
    const mockSetStatusMessage = vi.fn()

    mockUseAuthStoreGetState.mockReturnValue({
      setToken: mockSetToken,
    })

    mockUseUserStoreGetState.mockReturnValue({
      setId: mockSetId,
      setName: mockSetName,
      setEmail: mockSetEmail,
      setRole: mockSetRole,
    })

    mockUseGeneralStoreGetState.mockReturnValue({
      setIsLoading: mockSetIsLoading,
      setStatusMessage: mockSetStatusMessage,
    })

    mockAxiosApi.mockResolvedValueOnce({
      status: 201,
      data: {
        message: 'User successfully signed in.',
        token: userMock.token,
        user: {
          id: userMock.id,
          name: userMock.name,
          email: userMock.email,
          role: userMock.role,
        },
      },
    })

    const response = await signInRequest({
      email: userMock.email,
      password: userMock.password,
    })

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(1, true)

    expect(mockAxiosApi).toHaveBeenCalledWith({
      httpMethod: 'post',
      route: '/auth/sign-in',
      data: {
        email: userMock.email,
        password: userMock.password,
      },
    })

    expect(mockSetToken).toHaveBeenCalledWith(userMock.token)

    expect(mockSetId).toHaveBeenCalledWith(userMock.id)
    expect(mockSetName).toHaveBeenCalledWith(userMock.name)
    expect(mockSetEmail).toHaveBeenCalledWith(userMock.email)
    expect(mockSetRole).toHaveBeenCalledWith(userMock.role)

    expect(mockSetStatusMessage).toHaveBeenCalledWith('')
    expect(mockSetIsLoading).toHaveBeenNthCalledWith(2, false)

    expect(response.success).toBe(true)
  })

  it('should call RequestErrorHandler on API error', async () => {
    const error = new Error('API failed')

    const mockSetIsLoading = vi.fn()
    const mockSetStatusMessage = vi.fn()

    mockUseAuthStoreGetState.mockReturnValue({
      setToken: vi.fn(),
    })

    mockUseUserStoreGetState.mockReturnValue({
      setId: vi.fn(),
      setName: vi.fn(),
      setEmail: vi.fn(),
      setRole: vi.fn(),
    })

    mockUseGeneralStoreGetState.mockReturnValue({
      setIsLoading: mockSetIsLoading,
      setStatusMessage: mockSetStatusMessage,
    })

    mockAxiosApi.mockRejectedValueOnce(error)

    const response = await signInRequest({
      email: 'a@a.com',
      password: '123',
    })

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(1, true)

    expect(mockRequestErrorHandler).toHaveBeenCalledWith({
      error,
      setStatusMessage: mockSetStatusMessage,
    })

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(2, false)
    expect(response.success).toBe(false)
  })
})
