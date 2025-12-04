import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type {
  dailyWeatherType,
  geoType,
} from '@/types/store-types/weather-store-types'
import { dateSlashParse } from '@/utils/date-slash-parse'
import {
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface TemperatureChartProps {
  daily: dailyWeatherType[]
  geo: geoType
}

export function TemperatureChart({ daily, geo }: TemperatureChartProps) {
  const chartData = daily.map((day) => ({
    date: day.dt ? dateSlashParse(day.dt.replace('-2025', '')) : 'date',
    temp:
      day.max != null && day.min != null
        ? Math.round((day.max + day.min) / 2)
        : 0,
  }))

  return (
    <>
      <Card className="max-w-[360px] min-w-[360px] sm:max-w-[600px] sm:min-w-[450px] font-poppins border-2 border-cyan-200 hover:shadow-md hover:shadow-cyan-700">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-semibold">
            Weather chart for {geo.name}
          </CardTitle>
          <CardDescription>
            This chart shows the behavior of the <br /> mean temperature for the
            next 8 days
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center items-start flex justify-start pt-5">
          <ResponsiveContainer width={380} aspect={2.5}>
            <LineChart
              width={300}
              height={150}
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#0e7490">
                <LabelList dataKey="temp" position="bottom" stroke="#104e64" />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  )
}
