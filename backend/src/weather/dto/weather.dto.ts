import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CurrentWeatherDto {
  @IsString()
  dt: string;

  @IsOptional()
  @IsNumber()
  temp?: number;

  @IsOptional()
  @IsNumber()
  feels_like?: number;

  @IsOptional()
  @IsNumber()
  humidity?: number;

  @IsOptional()
  @IsNumber()
  wind_speed?: number;

  @IsOptional()
  @IsString()
  main_weather_status?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class DailyForecastDto {
  @IsString()
  dt: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsNumber()
  max?: number;

  @IsOptional()
  @IsNumber()
  min?: number;

  @IsOptional()
  @IsNumber()
  humidity?: number;

  @IsOptional()
  @IsNumber()
  wind_speed?: number;

  @IsOptional()
  @IsNumber()
  rain?: number;

  @IsOptional()
  @IsNumber()
  pop?: number;

  @IsOptional()
  @IsString()
  main?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class GeoInfoDto {
  @IsString()
  name: string;

  @IsString()
  country: string;

  @IsString()
  state: string;
}

export class WeatherDataDto {
  @ValidateNested()
  @Type(() => CurrentWeatherDto)
  current: CurrentWeatherDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyForecastDto)
  daily: DailyForecastDto[];

  @ValidateNested()
  @Type(() => GeoInfoDto)
  geo: GeoInfoDto;
}

export class RegisterWeatherDto {
  @ValidateNested()
  @Type(() => WeatherDataDto)
  weather: WeatherDataDto;
}
