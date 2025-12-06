import { describe, it, expect, vi, type Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { signInRequest } from '@/api/auth/sign-in-request'
import { userMock } from '@/__mocks__/user.mock'
import SignInForm from '../sign-in-form'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/api/auth/sign-in-request')

const mockSignInRequest = signInRequest as unknown as Mock

describe('SignInForm', () => {
  it('renders the form inputs and submit button', () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    )

    expect(screen.getByPlaceholderText('Your e-mail here')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Your password here'),
    ).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('submits the form successfully when inputs are valid', async () => {
    mockSignInRequest.mockResolvedValue({ success: true })

    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByPlaceholderText('Your e-mail here'), {
      target: { value: userMock.email },
    })
    fireEvent.change(screen.getByPlaceholderText('Your password here'), {
      target: { value: userMock.password },
    })

    fireEvent.click(screen.getByText('Sign In'))

    await waitFor(() => {
      expect(mockSignInRequest).toHaveBeenCalledWith({
        email: userMock.email,
        password: userMock.password,
      })
    })
  })

  it('does not call signInRequest when form validation fails', async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByPlaceholderText('Your e-mail here'), {
      target: { value: 'invalid-email' },
    })
    fireEvent.change(screen.getByPlaceholderText('Your password here'), {
      target: { value: 'short' },
    })

    fireEvent.click(screen.getByText('Sign In'))

    await waitFor(() => {
      expect(mockSignInRequest).not.toHaveBeenCalled()
    })
  })
})
