import '@testing-library/jest-dom';

// Polyfill TextEncoder for React Router v7
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock import.meta.env for Vite environment variables
global.import = global.import || {};
global.import.meta = {
  env: {
    VITE_API_URL: 'http://localhost:5000',
    VITE_SENTRY_DSN: '',
  },
};

// Set process.env for Jest compatibility
process.env.VITE_API_URL = 'http://localhost:5000';

// Mock process.env for Jest
process.env.VITE_API_URL = 'http://localhost:5000';