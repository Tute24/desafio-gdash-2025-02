import { useGeneralStore } from '@/stores/general/general.store'
import { AxiosApi } from '../axios-api'
import type { AIInsightsResponse } from '@/types/request-types/ai-insights-types'
import RequestErrorHandler from '../request-error-handler'

export async function getAiInsights() {
  const { setIsLoading, setAiInsights } = useGeneralStore.getState()
  try {
    setIsLoading(true)
    const response = await AxiosApi({
      httpMethod: 'get',
      route: '/ai/insights',
    })

    if (response.status === 200) {
      const responseData = response.data as AIInsightsResponse
      console.log(response.data)
      setAiInsights(responseData.weatherSummarization)
      return { success: true }
    }

    return { success: false }
  } catch (error) {
    setAiInsights(`Couldn't generate the insights.`)
    RequestErrorHandler({ error })
    return { success: false }
  } finally {
    setIsLoading(false)
  }
}
