import { getWeatherRequest } from '@/api/weather/get-weather-request'
import { Button } from '@/components/ui/button'
import { useWeatherStore } from '@/stores/weather/weather.store'
import { useEffect } from 'react'

export default function DashboardPage() {
  useEffect(() => {
    getWeatherRequest()
  }, [])
  const current = useWeatherStore((store) => store.current)
  const hasHydrated = useWeatherStore((store) => store.hasHydrated)
  if (!hasHydrated) {
    return (
      <>
        <div>Hidratando...</div>
      </>
    )
  }

  return (
    <>
      <div>
        Hello,World <Button>{current?.dt}</Button>
      </div>
    </>
  )
}
