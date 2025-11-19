module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['integration'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};