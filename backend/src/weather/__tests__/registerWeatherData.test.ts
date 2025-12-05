import { describe, it, expect, vi } from 'vitest';
import { WeatherService } from '../weather.service';
import { weatherMock } from 'src/__mocks__/weatherMock';
import { InternalServerErrorException } from '@nestjs/common';

describe('registerWeatherData', () => {
  const body = weatherMock;

  it('creates weather data', async () => {
    const mockWeatherModel = {
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(weatherMock),
    };

    const service = new WeatherService(mockWeatherModel as any);
    const result = await service.registerWeatherData(body);

    expect(result).toEqual({
      message: 'Weather data successfully registered in the database.',
    });
  });

  it('returns 500 if creation fails', async () => {
    const mockWeatherModel = {
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(null),
    };

    const service = new WeatherService(mockWeatherModel as any);

    await expect(service.registerWeatherData(body)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('updates weather data', async () => {
    const mockWeatherModel = {
      findOne: vi.fn().mockResolvedValue(weatherMock),
      updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }),
    };

    const service = new WeatherService(mockWeatherModel as any);
    const result = await service.registerWeatherData(body);

    expect(mockWeatherModel.findOne).toHaveBeenCalled();
    expect(mockWeatherModel.updateOne).toHaveBeenCalledWith({}, { $set: body });
    expect(result).toEqual({
      message: 'Weather data successfully updated.',
    });
  });

  it('returns 500 if creation fails', async () => {
    const mockWeatherModel = {
      findOne: vi.fn().mockResolvedValue(weatherMock),
      updateOne: vi.fn().mockResolvedValue({ modifiedCount: 0 }),
    };

    const service = new WeatherService(mockWeatherModel as any);

    await expect(service.registerWeatherData(body)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
