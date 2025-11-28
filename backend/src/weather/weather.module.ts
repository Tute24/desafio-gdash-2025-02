import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { weatherController } from './weather.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from './schema/weather-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Weather.name,
        schema: WeatherSchema,
      },
    ]),
  ],
  controllers: [weatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
