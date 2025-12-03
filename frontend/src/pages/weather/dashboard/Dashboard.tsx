import { getWeatherRequest } from '@/api/weather/get-weather-request'
import DashboardMain from '@/components/dashboard-components/dashboard-main'
import { useEffect } from 'react'

export default function DashboardPage() {
  useEffect(() => {
    getWeatherRequest()
  }, [])
  return (
    <>
      <DashboardMain />
    </>
  )
}
