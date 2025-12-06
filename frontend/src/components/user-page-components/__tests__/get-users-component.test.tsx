import { describe, it, expect, vi, type Mock } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { getUsersRequest } from '@/api/user/get-users-request'
import { useUserStore } from '@/stores/user/user.store'
import { GetUsersComponent } from '../get-users/get-users-component'
import { userMock } from '@/__mocks__/user.mock'

vi.mock('@/stores/user/user.store')
vi.mock('@/api/user/get-users-request')

const mockUseUserStore = useUserStore as unknown as Mock
const mockGetUsersRequest = getUsersRequest as unknown as Mock

describe('GetUsersComponent', () => {
  it('renders button and UsersListComponent for admin role', () => {
    mockUseUserStore.mockImplementation((selector) =>
      selector({ users: userMock.usersArray }),
    )
    render(<GetUsersComponent role="admin" />)

    expect(screen.getByText('Get All Users')).toBeInTheDocument()
  })

  it('does not render UsersListComponent for user role', () => {
    mockUseUserStore.mockImplementation((selector) => selector({ users: [] }))
    render(<GetUsersComponent role="user" />)
    expect(screen.queryByText('Get All Users')).not.toBeInTheDocument()
  })

  it('calls getUsersRequest and renders users on success', async () => {
    mockGetUsersRequest.mockResolvedValue({
      success: true,
      users: userMock.usersArray,
    })
    mockUseUserStore.mockImplementation((selector) =>
      selector({ users: userMock.usersArray }),
    )

    render(<GetUsersComponent role="admin" />)
    const button = screen.getByText('Get All Users')
    await fireEvent.click(button)

    expect(mockGetUsersRequest).toHaveBeenCalled()
    expect(
      screen.getByText(
        'Below there is a list of all the registered users on the application.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(userMock.usersArray[0].name)).toBeInTheDocument()
    expect(screen.getByText(userMock.usersArray[0].email)).toBeInTheDocument()
  })
})
