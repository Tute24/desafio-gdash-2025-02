import { useWeatherStore } from '@/stores/weather/weather.store'
import { CurrentWeatherCard } from './cards/current-weather-card'
import { dateSlashParse } from '@/utils/date-slash-parse'
import { FilesDownloader } from './downloader/files-downloader'
import { DailyWeatherCard } from './cards/daily-weather-card'
import { TemperatureChart } from './chart/temperature-chart'
import { InsightsComponent } from './insights/insights-component'
import { HydrationSpinner } from '../spinners/hydration-spinner'

// const currentAlt = {
//   dt: '',
//   temp: 0,
//   feels_like: 0,
//   humidity: 0,
//   wind_speed: 0,
//   main_weather_status: '',
//   description: '',
// }

// const geoAlt = {
//   name: '',
//   country: '',
//   state: '',
// }

export default function DashboardMain() {
  const current = useWeatherStore((store) => store.current)
  const geo = useWeatherStore((store) => store.geo)
  const daily = useWeatherStore((store) => store.daily)
  const hasHydrated = useWeatherStore((store) => store.hasHydrated)

  if (!hasHydrated || !geo || !current) {
    return (
      <div className="flex justify-center h-screen m-auto">
        <HydrationSpinner />
      </div>
    )
  }
  return (
    <>
      <div className="my-5 ml-5 text-xs sm:text-sm font-poppins font-semibold">
        <h2>
          Data collected at:{' '}
          <span className="text-cyan-700">
            {dateSlashParse(current?.dt)}
          </span>{' '}
        </h2>
      </div>
      <div className="flex flex-col items-center text-center py-10 gap-10 px-2 sm:px-0">
        <CurrentWeatherCard current={current} geo={geo} />
        <DailyWeatherCard daily={daily} geo={geo} />
        <div>
          <TemperatureChart daily={daily} geo={geo} />
        </div>
      </div>
      <div className="flex flex-col gap-10 justify-center items-center text-center pb-5">
        <InsightsComponent />
        <FilesDownloader />
      </div>
    </>
  )
}
