const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Mock OpenAI before any imports
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: '{"insights": ["Test insight"]}' } }],
        }),
      },
    },
  })),
}));

// Load environment variables
dotenv.config();

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect mongoose to in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Cleanup after each test
afterEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  // Close mongoose connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  // Stop in-memory MongoDB server
  await mongoServer.stop();
});

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  compare: jest.fn().mockImplementation((password, hash) => {
    // Mock comparison - return true if password matches 'password123'
    return Promise.resolve(password === 'password123');
  }),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
  verify: jest.fn().mockImplementation((token, secret, callback) => {
    // Mock verification - return a decoded user object
    if (token === 'token') {
      return { id: '507f1f77bcf86cd799439011' }; // Mock user ID
    }
    throw new Error('Invalid token');
  }),
}));

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

// Mock socket.io
jest.mock('socket.io', () => jest.fn(() => ({
  on: jest.fn(),
})));

// Set up global.io mock
global.io = {
  emit: jest.fn(),
};