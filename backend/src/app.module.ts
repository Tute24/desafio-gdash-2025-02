import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WeatherModule } from './weather/weather.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/weather-app'),
    ConfigModule.forRoot({
      isGlobal: true,
    }), //for loading env variables
    AuthModule,
    UsersModule,
    WeatherModule,
  ],
})
export class AppModule {}
