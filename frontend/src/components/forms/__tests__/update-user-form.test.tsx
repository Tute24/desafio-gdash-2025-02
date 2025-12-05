import { describe, it, expect, vi, type Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { updateUserRequest } from '@/api/user/update-user-request'
import { UpdateUserForm } from '../update-user-form'
import { userMock } from '@/__mocks__/user.mock'

vi.mock('@/api/user/update-user-request')

const mockUpdateUserRequest = updateUserRequest as unknown as Mock

describe('UpdateUserForm', () => {
  const defaultProps = {
    name: 'arthur',
    email: 'arthur@email.com',
  }

  it('renders with correct initial values and shows password fields when clicked', () => {
    render(
      <MemoryRouter>
        <UpdateUserForm {...defaultProps} />
      </MemoryRouter>,
    )

    expect(screen.getByDisplayValue(defaultProps.name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(defaultProps.email)).toBeInTheDocument()
    expect(
      screen.getByText('Update your user infos below:'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('You can update your name, e-mail and/or password.'),
    ).toBeInTheDocument()
    expect(screen.getByText('I want to update my password')).toBeInTheDocument()

    fireEvent.click(screen.getByText('I want to update my password'))
    expect(screen.getByText(/Update your password/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Confirm your password update/i),
    ).toBeInTheDocument()
  })

  it('updates name successfully', async () => {
    mockUpdateUserRequest.mockResolvedValue({ success: true })

    render(
      <MemoryRouter>
        <UpdateUserForm {...defaultProps} />
      </MemoryRouter>,
    )

    const nameEditButton = screen.getByTestId('pencil1')
    fireEvent.click(nameEditButton)
    fireEvent.change(screen.getByDisplayValue(defaultProps.name), {
      target: { value: userMock.name },
    })
    fireEvent.click(screen.getByText('Submit Update'))

    await waitFor(() => {
      expect(mockUpdateUserRequest).toHaveBeenCalledWith(
        expect.objectContaining({ name: userMock.name }),
      )
    })
  })

  it('updates password successfully', async () => {
    mockUpdateUserRequest.mockResolvedValue({ success: true })

    render(
      <MemoryRouter>
        <UpdateUserForm {...defaultProps} />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('I want to update my password'))
    fireEvent.change(screen.getByPlaceholderText(/Update your password/i), {
      target: { value: userMock.password },
    })
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), {
      target: { value: userMock.password },
    })
    fireEvent.click(screen.getByText('Submit Update'))

    await waitFor(() => {
      expect(mockUpdateUserRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          passwordUpdate: {
            password: userMock.password,
            confirmPassword: userMock.password,
          },
        }),
      )
    })
  })

  it('does not call updateUserRequest when password validation fails', async () => {
    render(
      <MemoryRouter>
        <UpdateUserForm {...defaultProps} />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('I want to update my password'))
    fireEvent.change(screen.getByPlaceholderText(/Update your password/i), {
      target: { value: 'Teste12345!' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), {
      target: { value: 'Teste123456!' },
    })
    fireEvent.click(screen.getByText('Submit Update'))

    await waitFor(() => {
      expect(mockUpdateUserRequest).not.toHaveBeenCalled()
    })
  })
})
