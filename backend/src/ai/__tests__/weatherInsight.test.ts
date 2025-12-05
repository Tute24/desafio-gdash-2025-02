import { describe, Mock, vi } from 'vitest';
import { main } from '../groq/groq-setup';
import { AIService } from '../ai.service';
import { weatherMock } from 'src/__mocks__/weatherMock';
import { NotFoundException } from '@nestjs/common';

vi.mock('../groq/groq-setup');

const mockGroqMain = main as Mock<typeof main>;

describe('weatherInisght', () => {
  it('returns weather summarization', async () => {
    const mockWeatherModel = { find: vi.fn() };
    mockWeatherModel.find.mockResolvedValue([weatherMock]);
    mockGroqMain.mockResolvedValue('insight');
    const service = new AIService(mockWeatherModel as any);
    const weatherInsight = await service.weatherInsight();
    expect(weatherInsight).toEqual({
      weatherSummarization: 'insight',
    });
  });

  it('throws 404 if theres no weather data', async () => {
    const mockWeatherModel = { find: vi.fn() };
    mockWeatherModel.find.mockResolvedValue(undefined);
    const service = new AIService(mockWeatherModel as any);
    await expect(service.weatherInsight()).rejects.toThrow(NotFoundException);
  });
});
