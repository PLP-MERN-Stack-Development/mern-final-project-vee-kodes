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

import axios from 'axios';
import api from './api';

const mockedAxios = axios;

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.location
delete global.window.location;
global.window.location = { href: '' };

describe('api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles successful response', async () => {
    const mockResponse = { data: 'success' };
    api.get.mockResolvedValue(mockResponse);

    const result = await api.get('/test');
    expect(result).toEqual(mockResponse);
  });
});