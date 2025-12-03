import { useGeneralStore } from '@/stores/general/general.store'
import RequestErrorHandler from '../request-error-handler'
import { AxiosApi } from '../axios-api'

export async function getFile(type: 'csv' | 'xlsx') {
  const { setIsLoading } = useGeneralStore.getState()

  try {
    setIsLoading(true)
    const response = await AxiosApi({
      httpMethod: 'get',
      route: `weather/${type}`,
      responseType: 'blob',
    })

    if (response.status === 200) {
      const blob = new Blob([response.data], {
        type:
          type === 'csv'
            ? 'text/csv; charset=utf-8'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `weather.${type}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      return { sucess: true }
    }

    return { success: false }
  } catch (error) {
    RequestErrorHandler({ error })
    return { success: false }
  } finally {
    setIsLoading(false)
  }
}
