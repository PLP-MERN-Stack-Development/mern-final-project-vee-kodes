import axios from 'axios';
import api from './api.js';

// Mock axios
jest.mock('axios');
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
delete window.location;
window.location = { href: '' };

describe('api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates axios instance with correct config', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('handles successful response', async () => {
    const mockResponse = { data: 'success' };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await api.get('/test');
    expect(result).toEqual(mockResponse);
  });

  test('handles error response and shows toast', async () => {
    const mockError = {
      response: { data: { message: 'Test error' } },
      message: 'Network error',
    };
    mockedAxios.get.mockRejectedValue(mockError);

    await expect(api.get('/test')).rejects.toEqual(mockError);
    expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Test error');
  });

  test('handles 401 error and redirects', async () => {
    const mockError = {
      response: { status: 401, data: { message: 'Unauthorized' } },
    };
    mockedAxios.get.mockRejectedValue(mockError);

    await expect(api.get('/test')).rejects.toEqual(mockError);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('agritrace-token');
    expect(window.location.href).toBe('/login');
  });

  test('handles error without response data', async () => {
    const mockError = {
      message: 'Network error',
    };
    mockedAxios.get.mockRejectedValue(mockError);

    await expect(api.get('/test')).rejects.toEqual(mockError);
    expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Network error');
  });

  test('handles unknown error', async () => {
    const mockError = {};
    mockedAxios.get.mockRejectedValue(mockError);

    await expect(api.get('/test')).rejects.toEqual(mockError);
    expect(require('react-toastify').toast.error).toHaveBeenCalledWith('An unknown error occurred');
  });
});