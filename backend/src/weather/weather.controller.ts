import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { RegisterWeatherDto } from './dto/weather.dto';
import type { Response } from 'express';

@Controller('weather')
export class weatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post('register')
  registerWeatherData(@Body() body: RegisterWeatherDto) {
    return this.weatherService.registerWeatherData(body);
  }

  @Get('get')
  getWeatherData() {
    return this.weatherService.getWeatherData();
  }

  @Get('xlsx')
  weatherXlsx(@Res() res: Response) {
    return this.weatherService.weatherXlsx(res);
  }
}
