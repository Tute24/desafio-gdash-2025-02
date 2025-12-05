import { describe, it, expect, vi, type Mock } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import LoggedHeader from '../logged-header'
import { signOutRequest } from '@/api/auth/sign-out-request'
import { Link } from 'react-router-dom'

vi.mock('@/api/auth/sign-out-request')

const mockSignOutRequest = signOutRequest as unknown as Mock

const mockNavigate = vi.fn()
const mockLink = Link as unknown as Mock
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: () => mockLink,
}))

describe('LoggedHeader', () => {
  it('renders the header with links and buttons', () => {
    render(<LoggedHeader />)

    expect(screen.getByTestId('dashboard-reference')).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: /signout/i })[0],
    ).toBeInTheDocument()
  })

  it('opens the modal when clicking the SignOut button', async () => {
    render(<LoggedHeader />)

    const signOutButton = screen.getAllByRole('button', { name: /signout/i })[0]

    fireEvent.click(signOutButton)

    expect(
      screen.getByText(/are you sure you want to sign out\?/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /sign out/i }),
    ).toBeInTheDocument()
  })

  it('calls signOutRequest and navigates when confirming SignOut', async () => {
    mockSignOutRequest.mockResolvedValue({
      success: true,
      message: 'Signed out!',
    })

    render(<LoggedHeader />)

    const signOutButton = screen.getAllByRole('button', { name: /signout/i })[0]

    fireEvent.click(signOutButton)

    const confirmButton = screen.getByRole('button', { name: /sign out/i })
    await fireEvent.click(confirmButton)

    expect(mockSignOutRequest).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
