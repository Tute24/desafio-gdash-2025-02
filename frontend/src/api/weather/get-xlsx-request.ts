import { useGeneralStore } from '@/stores/general/general.store'
import RequestErrorHandler from '../request-error-handler'
import { AxiosApi } from '../axios-api'

export async function getXlsx() {
  const { setIsLoading } = useGeneralStore.getState()

  try {
    setIsLoading(true)
    const response = await AxiosApi({
      httpMethod: 'get',
      route: '/weather/xlsx',
      responseType: 'blob',
    })

    if (response.status === 200) {
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'weather.xlsx'
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
