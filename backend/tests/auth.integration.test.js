// Mock OpenAI before importing anything
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

const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');

// Import the app after setting up mocks
const app = require('../server');

describe('Auth Integration Tests', () => {
  let adminToken;
  let adminUser;

  beforeEach(async () => {
    // Create an admin user directly in the database for testing
    adminUser = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'hashedpassword', // Mocked hash
      role: 'Admin',
      isDemo: false,
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', 'Test Admin');
      expect(response.body).toHaveProperty('email', 'admin@test.com');
      expect(response.body).toHaveProperty('role', 'Admin');
      expect(response.body).toHaveProperty('token');

      adminToken = response.body.token;
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user when authenticated as admin', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Field Officer',
          email: 'fieldofficer@test.com',
          password: 'password123',
          role: 'FieldOfficer',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', 'Test Field Officer');
      expect(response.body).toHaveProperty('email', 'fieldofficer@test.com');
      expect(response.body).toHaveProperty('role', 'FieldOfficer');
      expect(response.body).toHaveProperty('token');
    });

    it('should return 400 for duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Duplicate User',
          email: 'admin@test.com', // Same email as admin
          password: 'password123',
          role: 'FieldOfficer',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Unauthorized User',
          email: 'unauthorized@test.com',
          password: 'password123',
          role: 'FieldOfficer',
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid user data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          // Missing required fields
          email: 'invalid@test.com',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'All fields are required');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', adminUser._id.toString());
      expect(response.body).toHaveProperty('name', 'Test Admin');
      expect(response.body).toHaveProperty('email', 'admin@test.com');
      expect(response.body).toHaveProperty('role', 'Admin');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
    });
  });
});