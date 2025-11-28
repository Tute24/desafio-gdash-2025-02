import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, strict: false })
export class Weather extends Document {}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
