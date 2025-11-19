// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    readyState: 1,
  },
  Schema: jest.fn().mockImplementation(() => ({
    pre: jest.fn(),
    methods: {},
  })),
  model: jest.fn(),
  Types: {
    ObjectId: jest.fn(),
  },
}));

// Mock OpenAI
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

// Mock the OpenAI constructor
const mockOpenAI = jest.fn().mockImplementation(() => ({
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{ message: { content: '{"insights": ["Test insight"]}' } }],
      }),
    },
  },
}));

jest.doMock('openai', () => ({
  __esModule: true,
  default: mockOpenAI,
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
  verify: jest.fn(),
}));

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

// Mock socket.io
jest.mock('socket.io', () => jest.fn(() => ({
  on: jest.fn(),
})));

// Mock the database connection
jest.mock('../config/db.js', () => jest.fn());

// Set up global.io mock
global.io = {
  emit: jest.fn(),
};