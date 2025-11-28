import { Body, Controller, Get, Post } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class weatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post('register')
  registerWeatherData(@Body() body: any) {
    return this.weatherService.registerWeatherData(body);
  }

  @Get('get')
  getWeatherData() {
    return this.weatherService.getWeatherData();
  }
}
