import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Weather } from './schema/weather-schema';
import { Model } from 'mongoose';
import { RegisterWeatherDto } from './dto/weather.dto';
import * as exceljs from 'exceljs';
import type { Response } from 'express';

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

  async weatherXlsx(@Res() res: Response) {
    const weatherData = await this.weatherModel.find();
    if (weatherData.length === 0)
      throw new NotFoundException(
        `Couldn't find the weather data on the database.`,
      );

    const workbook = new exceljs.Workbook();

    const currentWeather = workbook.addWorksheet('current_weather');
    currentWeather.columns = Object.keys(weatherData[0].weather.current).map(
      (key) => ({
        header: key,
        key: key,
      }),
    );

    const dailyWeather = workbook.addWorksheet('daily_weather');
    dailyWeather.columns = Object.keys(weatherData[0].weather.daily[0]).map(
      (key) => ({
        header: key,
        key: key,
      }),
    );

    const geo = workbook.addWorksheet('geo');
    geo.columns = Object.keys(weatherData[0].weather.geo).map((key) => ({
      header: key,
      key: key,
    }));

    currentWeather.addRow(weatherData[0].weather.current);
    dailyWeather.addRows(weatherData[0].weather.daily);
    geo.addRow(weatherData[0].weather.geo);

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=weather.xlsx');

    return res.send(buffer);
  }
}
