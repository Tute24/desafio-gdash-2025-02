import { describe, it, expect, vi, type Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserPageMain } from '../user-page-main'
import { useUserStore } from '@/stores/user/user.store'
import { userMock } from '@/__mocks__/user.mock'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/stores/user/user.store')
const mockUseUserStore = useUserStore as unknown as Mock

describe('UserPageMain', () => {
  it('renders hydration spinner when store is not hydrated or missing name/email', () => {
    mockUseUserStore.mockImplementation((selector) =>
      selector({ hasHydrated: false, name: null, email: null, role: 'user' }),
    )

    render(<UserPageMain />)

    expect(screen.getByTestId('hydration-spinner')).toBeInTheDocument()
  })

  it('renders UpdateUserForm, GetUsersComponent (for admin), and DeleteUserComponent', () => {
    mockUseUserStore.mockImplementation((selector) =>
      selector({
        hasHydrated: true,
        name: userMock.usersArray[0].name,
        email: userMock.usersArray[0].email,
        role: 'admin',
        users: userMock.usersArray,
      }),
    )

    render(
      <MemoryRouter>
        <UserPageMain />
      </MemoryRouter>,
    )

    expect(
      screen.getByDisplayValue(userMock.usersArray[0].name),
    ).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(userMock.usersArray[0].email),
    ).toBeInTheDocument()
    expect(screen.getByText('Get All Users')).toBeInTheDocument()
    expect(screen.getByText('Delete User')).toBeInTheDocument()
  })
})
