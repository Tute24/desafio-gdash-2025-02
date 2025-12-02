import { useAuthStore } from '@/stores/auth/auth.store'
import axios from 'axios'

export interface AxiosApiProps {
  httpMethod: 'get' | 'post' | 'delete'
  route: string
  data?: Record<string, unknown>
}

const apiURL = import.meta.env.VITE_API_URL

export const axiosInstance = axios.create({
  baseURL: apiURL,
  timeout: 5000,
})

export function AxiosApi({ httpMethod, route, data }: AxiosApiProps) {
  const { token } = useAuthStore.getState()

  if (token) {
    return axiosInstance.request({
      method: httpMethod,
      url: route,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return axiosInstance.request({
    method: httpMethod,
    url: route,
    data,
  })
}
