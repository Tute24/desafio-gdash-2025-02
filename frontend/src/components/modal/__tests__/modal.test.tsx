import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ModalComponent } from '../modal'
import { Button } from '@/components/ui/button'

describe('ModalComponent', () => {
  it('renders the trigger button correctly', () => {
    const mockHandler = vi.fn()
    render(
      <ModalComponent
        guideText="Sign Out"
        dialogText="Sign Out"
        isLoading={false}
        requestHandler={mockHandler}
        buttonLayout={<Button>Sign Out</Button>}
      />,
    )

    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('opens the modal when clicking the trigger', async () => {
    const mockHandler = vi.fn()

    render(
      <ModalComponent
        guideText="Sign Out"
        dialogText="Sign Out"
        isLoading={false}
        requestHandler={mockHandler}
        buttonLayout={<Button>Open Modal</Button>}
      />,
    )

    await fireEvent.click(screen.getByText('Open Modal'))

    expect(
      screen.getByText('Are you sure you want to Sign Out?'),
    ).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls requestHandler when clicking the destructive button', async () => {
    const mockHandler = vi.fn()
    render(
      <ModalComponent
        guideText="Sign Out"
        dialogText="Sign Out"
        isLoading={false}
        requestHandler={mockHandler}
        buttonLayout={<Button>Open Modal</Button>}
      />,
    )

    await fireEvent.click(screen.getByText('Open Modal'))
    await fireEvent.click(screen.getByRole('button', { name: /sign out/i }))

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })
})
