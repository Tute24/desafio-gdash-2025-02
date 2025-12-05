import { describe, it, expect, vi, type Mock } from 'vitest'

import { AxiosApi } from '@/api/axios-api'
import RequestErrorHandler from '@/api/request-error-handler'
import { useGeneralStore } from '@/stores/general/general.store'
import { getAiInsights } from '../ai-insights-request'

vi.mock('@/api/axios-api')
vi.mock('@/api/request-error-handler')
vi.mock('@/stores/general/general.store')

const mockUseGeneralStore = useGeneralStore.getState as unknown as Mock
const mockAxiosApi = AxiosApi as unknown as Mock
const mockRequestErrorHandler = RequestErrorHandler as unknown as Mock

describe('getAiInsights', () => {
  it('should handle successfull request', async () => {
    const mockSetAiInsights = vi.fn()

    mockUseGeneralStore.mockReturnValue({
      setAiInsights: mockSetAiInsights,
    })

    mockAxiosApi.mockResolvedValueOnce({
      status: 200,
      data: {
        weatherSummarization: 'ai weather insights',
      },
    })

    const response = await getAiInsights()

    expect(mockAxiosApi).toHaveBeenCalledWith({
      httpMethod: 'get',
      route: '/ai/insights',
    })

    expect(mockSetAiInsights).toHaveBeenCalledWith('ai weather insights')

    expect(response.success).toBe(true)
  })

  it('should return success false when status is not 200', async () => {
    const mockSetAiInsights = vi.fn()

    mockUseGeneralStore.mockReturnValue({
      setAiInsights: mockSetAiInsights,
    })

    mockAxiosApi.mockResolvedValueOnce({
      status: 500,
      data: {},
    })

    const response = await getAiInsights()

    expect(mockSetAiInsights).not.toHaveBeenCalled()

    expect(response.success).toBe(false)
    expect(response.message).toBe(`Couldn't generate insights.`)
  })

  it('should call RequestErrorHandler on API error', async () => {
    const mockSetAiInsights = vi.fn()

    mockUseGeneralStore.mockReturnValue({
      setAiInsights: mockSetAiInsights,
    })

    const err = new Error('AI failed')
    mockAxiosApi.mockRejectedValueOnce(err)

    const response = await getAiInsights()

    expect(mockSetAiInsights).toHaveBeenCalledWith(
      `Couldn't generate the insights.`,
    )

    expect(mockRequestErrorHandler).toHaveBeenCalledWith({ error: err })

    expect(response.success).toBe(false)
  })
})
