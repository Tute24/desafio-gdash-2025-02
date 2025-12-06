import { describe, it, expect, vi, type Mock } from 'vitest'
import { render, screen } from '@testing-library/react'

import { useUserStore } from '@/stores/user/user.store'
import { userMock } from '@/__mocks__/user.mock'
import { UsersListComponent } from '../get-users/users-list-component'

vi.mock('@/stores/user/user.store')

const mockUseUserStore = useUserStore as unknown as Mock

describe('UsersListComponent', () => {
  it('renders the title and first user correctly', () => {
    mockUseUserStore.mockImplementation((selector) =>
      selector({
        users: userMock.usersArray,
      }),
    )

    render(<UsersListComponent />)

    expect(
      screen.getByText(
        'Below there is a list of all the registered users on the application.',
      ),
    ).toBeInTheDocument()

    expect(screen.getByText(userMock.usersArray[0].name)).toBeInTheDocument()
    expect(screen.getByText(userMock.usersArray[0].email)).toBeInTheDocument()
  })
})
