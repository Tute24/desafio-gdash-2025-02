import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Weather } from './schema/weather-schema';
import { Model } from 'mongoose';
import { RegisterWeatherDto } from './dto/weather.dto';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.name) private readonly weatherModel: Model<Weather>,
  ) {}

  async registerWeatherData(body: RegisterWeatherDto) {
    const weatherData = await this.weatherModel.findOne();

    if (!weatherData) {
      const newWeatherData = await this.weatherModel.create(body);
      if (!newWeatherData) {
        console.log('couldnt create data');
        throw new InternalServerErrorException(
          `There was an error creating the weather data register.`,
        );
      }
      return {
        message: 'Weather data successfully registered in the database.',
      };
    }

    console.log(body.weather.current);

    const update = await this.weatherModel.updateOne(
      {},
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

    return {
      message: 'Weather Data successfully fetched',
      data: weatherData,
    };
  }
}
