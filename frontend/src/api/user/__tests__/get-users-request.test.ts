import { describe, it, expect, vi, type Mock } from 'vitest'

import { getUsersRequest } from '@/api/user/get-users-request'
import { AxiosApi } from '@/api/axios-api'
import RequestErrorHandler from '@/api/request-error-handler'

import { useUserStore } from '@/stores/user/user.store'

import { userMock } from '@/__mocks__/user.mock'

vi.mock('@/api/axios-api')
vi.mock('@/api/request-error-handler')
vi.mock('@/stores/user/user.store')

const mockUseUserStore = useUserStore.getState as unknown as Mock
const mockAxiosApi = AxiosApi as unknown as Mock
const mockRequestErrorHandler = RequestErrorHandler as unknown as Mock

describe('getUsersRequest', () => {
  it('should handle successfull request', async () => {
    const mockSetUsers = vi.fn()

    mockUseUserStore.mockReturnValue({
      setUsers: mockSetUsers,
    })

    mockAxiosApi.mockResolvedValueOnce({
      status: 200,
      data: {
        message: 'Users fetched successfully',
        users: userMock.usersArray,
      },
    })

    const response = await getUsersRequest()

    expect(mockAxiosApi).toHaveBeenCalledWith({
      httpMethod: 'get',
      route: '/users/get',
    })

    expect(mockSetUsers).toHaveBeenCalledWith(userMock.usersArray)
    expect(response.success).toBe(true)
  })

  it('should return success false when status is not 200', async () => {
    const mockSetUsers = vi.fn()

    mockUseUserStore.mockReturnValue({
      setUsers: mockSetUsers,
    })

    mockAxiosApi.mockResolvedValueOnce({
      status: 404,
      data: {},
    })

    const response = await getUsersRequest()

    expect(mockSetUsers).not.toHaveBeenCalled()
    expect(response.success).toBe(false)
    expect(response.message).toBe(`Couldn't fetch the users.`)
  })

  it('should call RequestErrorHandler on API error', async () => {
    const mockSetUsers = vi.fn()

    mockUseUserStore.mockReturnValue({
      setUsers: mockSetUsers,
    })

    const err = new Error('API failed')
    mockAxiosApi.mockRejectedValueOnce(err)

    const response = await getUsersRequest()

    expect(mockRequestErrorHandler).toHaveBeenCalledWith({ error: err })
    expect(mockSetUsers).not.toHaveBeenCalled()
    expect(response.success).toBe(false)
  })
})
