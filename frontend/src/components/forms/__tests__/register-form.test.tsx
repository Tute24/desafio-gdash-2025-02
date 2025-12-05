import { describe, it, expect, vi, type Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import RegisterForm from '../register-form'
import { registerRequest } from '@/api/auth/register-request'
import { useGeneralStore } from '@/stores/general/general.store'
import { userMock } from '@/__mocks__/user.mock'

vi.mock('@/api/auth/register-request')
vi.mock('@/stores/general/general.store')

const mockRegisterRequest = registerRequest as unknown as Mock
const mockUseGeneralStore = useGeneralStore as unknown as Mock

describe('RegisterForm', () => {
  it('renders all fields correctly', () => {
    mockUseGeneralStore.mockImplementation((selector) =>
      selector({ statusMessage: '', isLoading: false }),
    )

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )

    expect(screen.getByText('Create an account below:')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your name here')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your e-mail here')).toBeInTheDocument()
    expect(screen.getAllByPlaceholderText('Your password here').length).toBe(2)
    expect(screen.getByText('Register')).toBeInTheDocument()
  })

  it('submits form successfully and calls registerRequest with correct data', async () => {
    mockUseGeneralStore.mockImplementation((selector) =>
      selector({ statusMessage: '', isLoading: false }),
    )

    mockRegisterRequest.mockResolvedValue({ success: true })

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByPlaceholderText('Your name here'), {
      target: { value: userMock.name },
    })
    fireEvent.change(screen.getByPlaceholderText('Your e-mail here'), {
      target: { value: userMock.email },
    })
    fireEvent.change(screen.getAllByPlaceholderText('Your password here')[0], {
      target: { value: userMock.password },
    })
    fireEvent.change(screen.getAllByPlaceholderText('Your password here')[1], {
      target: { value: userMock.password },
    })

    fireEvent.click(screen.getByText('Register'))

    await waitFor(() => {
      expect(mockRegisterRequest).toHaveBeenCalledWith({
        name: userMock.name,
        email: userMock.email,
        password: userMock.password,
        confirmPassword: userMock.password,
      })
    })
  })

  it('does not submit when form validation fails', async () => {
    mockUseGeneralStore.mockImplementation((selector) =>
      selector({ statusMessage: '', isLoading: false }),
    )

    mockRegisterRequest.mockClear()

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByPlaceholderText('Your name here'), {
      target: { value: 'A' },
    })
    fireEvent.change(screen.getByPlaceholderText('Your e-mail here'), {
      target: { value: 'a@a' },
    })
    fireEvent.change(screen.getAllByPlaceholderText('Your password here')[0], {
      target: { value: '123' },
    })
    fireEvent.change(screen.getAllByPlaceholderText('Your password here')[1], {
      target: { value: '456' },
    })

    fireEvent.click(screen.getByText('Register'))

    await waitFor(() => {
      expect(mockRegisterRequest).not.toHaveBeenCalled()
    })
  })
})
