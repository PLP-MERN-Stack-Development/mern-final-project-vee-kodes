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
    post: jest.fn(),
    interceptors: {
      response: {
        use: jest.fn(),
      },
    },
  })),
}));

import * as farmerService from './farmerService.js';

const mockAxios = require('axios');
const mockApi = mockAxios.create.mock.results[0].value;

describe('farmerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFarmers', () => {
    test('returns farmers data on success', async () => {
      const mockData = [{ id: 1, name: 'Farmer One' }];
      mockApi.get.mockResolvedValue({ data: mockData });

      const result = await farmerService.getAllFarmers();
      expect(mockApi.get).toHaveBeenCalledWith('/api/farmers');
      expect(result).toEqual(mockData);
    });

    test('throws error on failure', async () => {
      const mockError = new Error('API Error');
      mockApi.get.mockRejectedValue(mockError);

      await expect(farmerService.getAllFarmers()).rejects.toThrow('API Error');
    });
  });

  describe('getFarmerDetails', () => {
    test('returns farmer details on success', async () => {
      const mockData = { id: 1, name: 'Farmer One', region: 'Central' };
      mockApi.get.mockResolvedValue({ data: mockData });

      const result = await farmerService.getFarmerDetails(1);
      expect(mockApi.get).toHaveBeenCalledWith('/api/farmers/1');
      expect(result).toEqual(mockData);
    });

    test('throws error on failure', async () => {
      const mockError = new Error('API Error');
      mockApi.get.mockRejectedValue(mockError);

      await expect(farmerService.getFarmerDetails(1)).rejects.toThrow('API Error');
    });
  });

  describe('registerFarmer', () => {
    test('returns registered farmer data on success', async () => {
      const farmerData = { name: 'New Farmer', region: 'Central' };
      const mockData = { id: 2, ...farmerData };
      mockApi.post.mockResolvedValue({ data: mockData });

      const result = await farmerService.registerFarmer(farmerData);
      expect(mockApi.post).toHaveBeenCalledWith('/api/farmers', farmerData);
      expect(result).toEqual(mockData);
    });

    test('throws error on failure', async () => {
      const mockError = new Error('API Error');
      mockApi.post.mockRejectedValue(mockError);

      await expect(farmerService.registerFarmer({})).rejects.toThrow('API Error');
    });
  });

  describe('addFarmActivity', () => {
    test('returns activity data on success', async () => {
      const activityData = { farmerId: 1, type: 'Planting', date: '2023-10-01' };
      const mockData = { id: 1, ...activityData };
      mockApi.post.mockResolvedValue({ data: mockData });

      const result = await farmerService.addFarmActivity(activityData);
      expect(mockApi.post).toHaveBeenCalledWith('/api/activities', activityData);
      expect(result).toEqual(mockData);
    });

    test('throws error on failure', async () => {
      const mockError = new Error('API Error');
      mockApi.post.mockRejectedValue(mockError);

      await expect(farmerService.addFarmActivity({})).rejects.toThrow('API Error');
    });
  });

  describe('recordCollection', () => {
    test('returns collection data on success', async () => {
      const collectionData = { farmerId: 1, weight: 500, qualityGrade: 'A' };
      const mockData = { id: 1, ...collectionData };
      mockApi.post.mockResolvedValue({ data: mockData });

      const result = await farmerService.recordCollection(collectionData);
      expect(mockApi.post).toHaveBeenCalledWith('/api/collections', collectionData);
      expect(result).toEqual(mockData);
    });

    test('throws error on failure', async () => {
      const mockError = new Error('API Error');
      mockApi.post.mockRejectedValue(mockError);

      await expect(farmerService.recordCollection({})).rejects.toThrow('API Error');
    });
  });
});