import { describe, it, expect, vi, Mock } from 'vitest';
import { WeatherService } from '../weather.service';
import { NotFoundException } from '@nestjs/common';
import { weatherMock } from 'src/__mocks__/weatherMock';
import * as exceljs from 'exceljs';

vi.mock('exceljs', () => {
  return {
    Workbook: vi.fn(),
  };
});

const mockWorkBook = exceljs.Workbook as unknown as Mock;

describe('weatherXlsx', () => {
  it('generates XLSX and sends it in the response', async () => {
    const writeBufferMock = vi
      .fn()
      .mockResolvedValue(Buffer.from('xlsx-buffer'));

    const addWorksheetMock = vi.fn().mockReturnValue({
      columns: [],
      addRow: vi.fn(),
      addRows: vi.fn(),
    });

    mockWorkBook.mockImplementation(function () {
      return {
        addWorksheet: addWorksheetMock,
        xlsx: { writeBuffer: writeBufferMock },
      };
    });

    const mockWeatherModel = {
      find: vi.fn().mockResolvedValue([weatherMock]),
    };

    const res = {
      setHeader: vi.fn(),
      send: vi.fn(),
    };

    const service = new WeatherService(mockWeatherModel as any);

    await service.weatherXlsx(res as any);

    expect(mockWeatherModel.find).toHaveBeenCalled();
    expect(addWorksheetMock).toHaveBeenCalledTimes(3);
    expect(writeBufferMock).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledTimes(2);
    expect(res.send).toHaveBeenCalledWith(Buffer.from('xlsx-buffer'));
  });

  it('returns 404 when no data exists', async () => {
    const mockWeatherModel = {
      find: vi.fn().mockResolvedValue([]),
    };

    const res = {
      setHeader: vi.fn(),
      send: vi.fn(),
    };

    const service = new WeatherService(mockWeatherModel as any);

    await expect(service.weatherXlsx(res as any)).rejects.toThrow(
      NotFoundException,
    );
  });
});
