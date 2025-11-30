import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from 'src/weather/schema/weather-schema';
import { main } from './groq/groq-setup';
import { WeatherType } from 'src/types/weather';

@Injectable()
export class AIService {
  constructor(
    @InjectModel(Weather.name) private readonly weatherModel: Model<Weather>,
  ) {}

  async weatherInsight() {
    const weather = await this.weatherModel.find();
    if (!weather)
      throw new NotFoundException('No weather data found in the database.');

    const weatherData: WeatherType = weather[0];
    const weatherSummarization = await main(weatherData);

    return {
      weatherSummarization,
    };
  }
}
