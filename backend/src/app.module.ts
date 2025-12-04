import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WeatherModule } from './weather/weather.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AIModule } from './ai/ai.module';
import { RolesGuard } from './auth/guards/role.guard';
import { APP_GUARD } from '@nestjs/core';

const mongoURI = process.env.MONGO_URI
  ? process.env.MONGO_URI
  : 'mongodb://localhost:27017/weather-app';
@Module({
  imports: [
    MongooseModule.forRoot(mongoURI),
    ConfigModule.forRoot({
      isGlobal: true,
    }), //for loading env variables
    AuthModule,
    UsersModule,
    WeatherModule,
    AIModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
