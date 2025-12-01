import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class CurrentWeather {
  @Prop()
  dt: string;

  @Prop()
  temp: number;

  @Prop()
  feels_like: number;

  @Prop()
  humidity: number;

  @Prop()
  wind_speed: number;

  @Prop()
  main_weather_status: string;

  @Prop()
  description: string;
}

class DailyForecast {
  @Prop()
  dt: string;

  @Prop()
  summary: string;

  @Prop()
  max: number;

  @Prop()
  min: number;

  @Prop()
  humidity: number;

  @Prop()
  wind_speed: number;

  @Prop()
  rain: number;

  @Prop()
  pop: number;

  @Prop()
  main: string;

  @Prop()
  description: string;
}

class GeoInfo {
  @Prop()
  name: string;

  @Prop()
  country: string;

  @Prop()
  state: string;
}

export class RegisterWeather {
  @Prop({ type: CurrentWeather })
  current: CurrentWeather;

  @Prop({ type: [DailyForecast] })
  daily: DailyForecast[];

  @Prop({ type: GeoInfo })
  geo: GeoInfo;
}

@Schema({ timestamps: true, versionKey: false })
export class Weather extends Document {
  @Prop({ type: RegisterWeather })
  weather: RegisterWeather;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
