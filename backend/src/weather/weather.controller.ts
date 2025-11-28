import { Body, Controller, Get, Post } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { RegisterWeatherDto } from './dto/weather.dto';

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
}
