import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class CurrentWeather {
  @Prop({ type: String })
  dt: string;

  @Prop({ type: Number })
  temp: number;

  @Prop({ type: Number })
  feels_like: number;

  @Prop({ type: Number })
  humidity: number;

  @Prop({ type: Number })
  wind_speed: number;

  @Prop({ type: String })
  main_weather_status: string;

  @Prop({ type: String })
  description: string;
}

class DailyForecast {
  @Prop({ type: String })
  dt: string;

  @Prop({ type: String })
  summary: string;

  @Prop({ type: Number })
  max: number;

  @Prop({ type: Number })
  min: number;

  @Prop({ type: Number })
  humidity: number;

  @Prop({ type: Number })
  wind_speed: number;

  @Prop({ type: Number })
  rain: number;

  @Prop({ type: Number })
  pop: number;

  @Prop({ type: String })
  main: string;

  @Prop({ type: String })
  description: string;
}

class GeoInfo {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
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
