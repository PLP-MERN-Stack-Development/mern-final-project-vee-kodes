// Mock import.meta.env
global.import = global.import || {};
global.import.meta = {
  env: {
    VITE_API_URL: 'http://localhost:5000',
  },
};

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    interceptors: {
      response: {
        use: jest.fn(),
      },
    },
  })),
}));

import * as aiService from './aiService.js';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockAxios = require('axios');
const mockApi = mockAxios.create.mock.results[0].value;
describe('aiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardInsights', () => {
    test('returns insights data on success', async () => {
      const mockData = { insights: ['Insight 1', 'Insight 2'] };
      mockApi.get.mockResolvedValue({ data: mockData });

      const result = await aiService.getDashboardInsights();
      expect(mockApi.get).toHaveBeenCalledWith('/api/ai/insights');
      expect(result).toEqual(mockData);
    });

    test('throws error on failure', async () => {
      const mockError = new Error('API Error');
      mockApi.get.mockRejectedValue(mockError);

      await expect(aiService.getDashboardInsights()).rejects.toThrow('API Error');
    });
  });

  describe('getFarmerSummary', () => {
    test('returns farmer summary on success', async () => {
      const mockData = { summary: 'Farmer summary text' };
      mockApi.get.mockResolvedValue({ data: mockData });

      const result = await aiService.getFarmerSummary(1);
      expect(mockApi.get).toHaveBeenCalledWith('/api/ai/farmer-summary/1');
      expect(result).toEqual(mockData);
    });

    test('throws error on failure', async () => {
      const mockError = new Error('API Error');
      mockApi.get.mockRejectedValue(mockError);

      await expect(aiService.getFarmerSummary(1)).rejects.toThrow('API Error');
    });
  });

  describe('getYieldByRegionChart', () => {
    test('returns formatted chart data on success', async () => {
      const mockApiData = { labels: ['Central', 'Rift Valley'], series: [5000, 8000] };
      mockApi.get.mockResolvedValue({ data: mockApiData });

      const result = await aiService.getYieldByRegionChart();
      expect(mockApi.get).toHaveBeenCalledWith('/api/ai/analytics/yield-by-region');
      expect(result).toEqual({
        labels: ['Central', 'Rift Valley'],
        datasets: [
          {
            label: 'Total Yield (Kg)',
            data: [5000, 8000],
            backgroundColor: 'rgba(22, 163, 74, 0.6)',
            borderColor: 'rgba(22, 163, 74, 1)',
            borderWidth: 1,
          },
        ],
      });
    });

    test('throws error on failure', async () => {
      const mockError = new Error('API Error');
      mockApi.get.mockRejectedValue(mockError);

      await expect(aiService.getYieldByRegionChart()).rejects.toThrow('API Error');
    });
  });

  describe('getQualityDistributionChart', () => {
    test('returns formatted pie chart data on success', async () => {
      const mockApiData = { labels: ['A', 'B'], series: [1000, 500] };
      mockApi.get.mockResolvedValue({ data: mockApiData });

      const result = await aiService.getQualityDistributionChart();
      expect(mockApi.get).toHaveBeenCalledWith('/api/ai/analytics/quality-distribution');
      expect(result).toEqual({
        labels: ['A', 'B'],
        datasets: [
          {
            label: 'Produce Grade',
            data: [1000, 500],
            backgroundColor: [
              'rgba(22, 163, 74, 0.6)',
              'rgba(234, 179, 8, 0.6)',
            ],
            borderColor: [
              'rgba(22, 163, 74, 1)',
              'rgba(234, 179, 8, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    });

    test('throws error on failure', async () => {
      const mockError = new Error('API Error');
      mockApi.get.mockRejectedValue(mockError);

      await expect(aiService.getQualityDistributionChart()).rejects.toThrow('API Error');
    });
  });

  describe('getCollectionsOverTimeChart', () => {
    test('returns formatted line chart data on success', async () => {
      const mockApiData = { labels: ['2023-01-01', '2023-01-02'], series: [500, 750] };
      mockApi.get.mockResolvedValue({ data: mockApiData });

      const result = await aiService.getCollectionsOverTimeChart();
      expect(mockApi.get).toHaveBeenCalledWith('/api/ai/analytics/collections-timeseries');
      expect(result).toEqual({
        labels: ['2023-01-01', '2023-01-02'],
        datasets: [
          {
            label: 'Collections Over Time',
            data: [500, 750],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      });
    });

    test('throws error on failure', async () => {
      const mockError = new Error('API Error');
      mockApi.get.mockRejectedValue(mockError);

      await expect(aiService.getCollectionsOverTimeChart()).rejects.toThrow('API Error');
    });
  });

  describe('getYieldForecast', () => {
    test('returns forecast data on success', async () => {
      const mockData = { forecasts: ['Forecast 1', 'Forecast 2'] };
      mockApi.get.mockResolvedValue({ data: mockData });

      const result = await aiService.getYieldForecast();
      expect(mockApi.get).toHaveBeenCalledWith('/api/ai/analytics/yield-forecast');
      expect(result).toEqual(mockData);
    });

    test('throws error on failure', async () => {
      const mockError = new Error('API Error');
      mockApi.get.mockRejectedValue(mockError);

      await expect(aiService.getYieldForecast()).rejects.toThrow('API Error');
    });
  });
});