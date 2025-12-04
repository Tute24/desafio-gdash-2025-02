import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { RegisterWeatherDto } from './dto/weather.dto';
import type { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('weather')
export class weatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post('register')
  registerWeatherData(@Body() body: RegisterWeatherDto) {
    return this.weatherService.registerWeatherData(body);
  }

  @UseGuards(AuthGuard)
  @Get('get')
  getWeatherData() {
    return this.weatherService.getWeatherData();
  }

  @UseGuards(AuthGuard)
  @Get('xlsx')
  weatherXlsx(@Res() res: Response) {
    return this.weatherService.weatherXlsx(res);
  }

  @UseGuards(AuthGuard)
  @Get('csv')
  weatherCsv(@Res() res: Response) {
    return this.weatherService.weatherCsv(res);
  }
}
