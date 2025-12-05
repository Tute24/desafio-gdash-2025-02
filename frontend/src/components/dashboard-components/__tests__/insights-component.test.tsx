import { describe, it, expect, vi, type Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { getAiInsights } from '@/api/ai/ai-insights-request'
import { useGeneralStore } from '@/stores/general/general.store'
import { InsightsComponent } from '../insights/insights-component'

vi.mock('@/api/ai/ai-insights-request')
vi.mock('@/stores/general/general.store')

const mockGetAiInsights = getAiInsights as unknown as Mock
const mockUseGeneralStore = useGeneralStore as unknown as Mock

describe('InsightsComponent', () => {
  it('renders title and button', () => {
    mockUseGeneralStore.mockReturnValue(null)

    render(<InsightsComponent />)

    expect(
      screen.getByText('You can request AI generated insights based', {
        exact: false,
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Get Weather Insights')).toBeInTheDocument()
  })

  it('calls getAiInsights when clicking the button', async () => {
    mockUseGeneralStore.mockReturnValue(null)
    mockGetAiInsights.mockResolvedValue({ success: true })

    render(<InsightsComponent />)

    fireEvent.click(screen.getByText('Get Weather Insights'))

    await waitFor(() => {
      expect(getAiInsights).toHaveBeenCalled()
    })
  })

  it('renders insights text when store provides aiInsights', () => {
    mockUseGeneralStore.mockReturnValue('ai insights')

    render(<InsightsComponent />)

    expect(screen.getByText('ai insights')).toBeInTheDocument()
  })
})
