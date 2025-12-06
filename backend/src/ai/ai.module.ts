import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from 'src/weather/schema/weather-schema';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Weather.name,
        schema: WeatherSchema,
      },
    ]),
  ],
  controllers: [AIController],
  providers: [AIService],
})
export class AIModule {}
