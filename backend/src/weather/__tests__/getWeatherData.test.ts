import { describe, it, expect, vi } from 'vitest';
import { WeatherService } from '../weather.service';
import { NotFoundException } from '@nestjs/common';
import { weatherMock } from 'src/__mocks__/weatherMock';

describe('getWeatherData', () => {
  it('returns weather data successfully', async () => {
    const mockWeatherModel = {
      find: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue([weatherMock]),
      }),
    };

    const service = new WeatherService(mockWeatherModel as any);
    const result = await service.getWeatherData();

    expect(result).toEqual({
      message: 'Weather Data successfully fetched',
      data: weatherMock,
    });
  });

  it('returns 404 when no weather data exists', async () => {
    const mockWeatherModel = {
      find: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue([]),
      }),
    };

    const service = new WeatherService(mockWeatherModel as any);

    await expect(service.getWeatherData()).rejects.toThrow(NotFoundException);
  });
});
