import type {
  currentWeatherType,
  geoType,
} from '@/types/store-types/weather-store-types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card'
import { Droplet, SunSnow, Wind } from 'lucide-react'
import { toTitleCase } from '@/utils/to-title-case'

export interface CurrentWeatherProps {
  current: currentWeatherType
  geo: geoType
}

export function CurrentWeatherCard({ current, geo }: CurrentWeatherProps) {
  return (
    <>
      <Card className="max-w-[420px] min-w-[360px] sm:max-w-[600px] sm:min-w-[450px] p-3 font-poppins border-2 border-cyan-200 hover:shadow-md hover:shadow-cyan-700">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-lg sm:text-xl w-full">
            Current weather in {geo.name}
          </CardTitle>
          <CardDescription className="flex flex-col items-center text-center gap-1">
            <p className="text-3xl font-bold text-cyan-700">
              {current.temp ? Math.round(current.temp) : 0}°
            </p>
            <p className="text-xl text-neutral-800">
              {toTitleCase(current.description)}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-3 text-lg">
          <div className="flex flex-row gap-5">
            <SunSnow className="text-cyan-700" size={30} />
            <p>
              <span className="font-semibold">Feels like:</span>{' '}
              {current.feels_like ? Math.round(current.feels_like) : 0}°
            </p>
          </div>
          <div className="flex flex-row gap-5">
            <Droplet className="text-cyan-700" size={30} />
            <p>
              <span className="font-semibold">Humidty:</span> {current.humidity}
              %
            </p>
          </div>
          <div className="flex flex-row gap-5">
            <Wind className="text-cyan-700" size={30} />
            <p>
              <span className="font-semibold">Wind speed:</span>{' '}
              {current.wind_speed ? Math.round(current.wind_speed * 3.6) : 0}
              km/h
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
