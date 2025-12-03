import type {
  dailyWeatherType,
  geoType,
} from '@/types/store-types/weather-store-types'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { dateSlashParse } from '@/utils/date-slash-parse'
import { CloudRainWind, Droplet, MoveDown, MoveUp, Wind } from 'lucide-react'

export interface DailyWeatherProps {
  daily: dailyWeatherType[]
  geo: geoType
}

export function DailyWeatherCard({ daily, geo }: DailyWeatherProps) {
  return (
    <>
      <Card className="max-w-[420px] min-w-[360px] sm:max-w-[600px] sm:min-w-[450px] sm:p-3 font-poppins border-2 border-cyan-200 hover:shadow-md hover:shadow-cyan-700">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-lg sm:text-xl w-full">
            Next 8 days weather overview for {geo.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col text-xs">
          <ul>
            {daily.map((day, index) => (
              <li key={day.dt} className="py-4 text-center items-center">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 items-center text-center">
                  <p className="flex justify-center font-semibold">
                    {index === 0 ? 'Today' : dateSlashParse(day.dt)}
                  </p>
                  <div className="flex flex-row gap-1 justify-center">
                    <div className="flex flex-row items-center text-red-700">
                      <MoveUp size={24} />
                      {day.max ? Math.round(day.max) : 0}°
                    </div>
                    <div className="flex flex-row items-center text-blue-700">
                      <MoveDown size={24} />
                      {day.min ? Math.round(day.min) : 0}°
                    </div>
                  </div>
                  <div className="flex flex-row gap-1 items-center justify-center">
                    <Droplet size={24} />
                    {day.humidity}%
                  </div>
                  <div className="flex flex-row gap-1 items-center justify-center">
                    <CloudRainWind size={24} />
                    <p>{day.rain ? Math.round(day.rain) : 0}mm</p>
                  </div>
                  <div className="sm:flex sm:flex-row gap-1 items-center hidden justify-center">
                    <Wind className="text-cyan-700" size={24} />
                    <p>
                      {day.wind_speed ? Math.round(day.wind_speed * 3.6) : 0}
                      km/h
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  )
}
