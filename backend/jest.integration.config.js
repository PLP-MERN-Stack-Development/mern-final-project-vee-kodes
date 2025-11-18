module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.integration.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/integration-setup.js'],
  testTimeout: 30000, // Longer timeout for integration tests
  // Don't use the global setup.js that mocks mongoose
  setupFiles: [],
};