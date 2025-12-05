import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import UnLoggedHeader from '../unlogged-header'

describe('UnLoggedHeader', () => {
  it('renders correctly and has working links', () => {
    render(
      <MemoryRouter>
        <UnLoggedHeader />
      </MemoryRouter>,
    )

    const signInLink = screen.getByText('Sign In')
    const registerLink = screen.getByText('Register')

    expect(signInLink).toBeInTheDocument()
    expect(registerLink).toBeInTheDocument()
    expect(signInLink.closest('a')).toHaveAttribute('href', '/')
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register')
  })
})
