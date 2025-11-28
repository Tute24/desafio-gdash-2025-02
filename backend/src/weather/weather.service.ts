import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Weather } from './schema/weather-schema';
import { Model } from 'mongoose';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.name) private readonly weatherModel: Model<Weather>,
  ) {}

  async registerWeatherData(body: any) {
    const weatherData = await this.weatherModel.findOne();

    if (!weatherData) {
      const newWeatherData = await this.weatherModel.create(body);
      if (!newWeatherData)
        throw new InternalServerErrorException(
          `There was an error creating the weather data register.`,
        );
      return {
        message: 'Weather data successfully registered in the database.',
      };
    }

    const update = await this.weatherModel.updateOne(
      { _id: weatherData._id },
      {
        $set: body,
      },
    );

    if (update.modifiedCount === 0)
      throw new InternalServerErrorException(
        `There was an error updating the weather data register`,
      );

    return {
      message: 'Weather data successfully updated.',
    };
  }

  async getWeatherData() {
    const weatherData = await this.weatherModel.find();

    if (weatherData.length === 0)
      throw new NotFoundException(
        `Couldn't find the weather data on the database.`,
      );
  }
}
