// Set up global mocks before importing
global.io = { emit: jest.fn() };

const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const FarmActivity = require('../models/FarmActivity');

// Import the app after setting up mocks
const app = require('../server');

describe('Activity Integration Tests', () => {
  let adminToken;
  let fieldOfficerToken;
  let adminUser;
  let fieldOfficerUser;
  let testFarmer;
  let testActivity;

  beforeEach(async () => {
    // Create admin user
    adminUser = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'hashedpassword',
      role: 'Admin',
      isDemo: false,
    });

    // Create field officer user
    fieldOfficerUser = await User.create({
      name: 'Test Field Officer',
      email: 'fieldofficer@test.com',
      password: 'hashedpassword',
      role: 'FieldOfficer',
      isDemo: false,
    });

    // Create test farmer
    testFarmer = await Farmer.create({
      name: 'Test Farmer',
      region: 'Nairobi',
      contact: '+254712345678',
      contractedCrop: 'Maize',
      contractId: 'TEST001',
      registeredBy: adminUser._id,
    });

    // Get tokens by mocking login
    adminToken = 'token'; // Mocked token
    fieldOfficerToken = 'token'; // Mocked token

    // Create a test activity
    testActivity = await FarmActivity.create({
      farmer: testFarmer._id,
      recordedBy: adminUser._id,
      type: 'Planting',
      date: new Date(),
      cost: 1000,
      seedVariety: 'Hybrid Maize',
      seedSource: 'Local Supplier',
      seedQuantity: 50,
      generalDetails: 'Planted 50kg of hybrid maize seeds',
    });
  });

  describe('POST /api/activities', () => {
    it('should create an activity when authenticated as admin', async () => {
      const response = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          farmerId: testFarmer._id.toString(),
          type: 'Weeding',
          date: '2024-01-15',
          cost: 500,
          generalDetails: 'Manual weeding of maize field',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('type', 'Weeding');
      expect(response.body).toHaveProperty('cost', 500);
    });

    it('should create an activity when authenticated as field officer', async () => {
      const response = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${fieldOfficerToken}`)
        .send({
          farmerId: testFarmer._id.toString(),
          type: 'Fertilizer Application',
          date: '2024-02-01',
          cost: 800,
          fertilizerType: 'NPK',
          fertilizerAmount: '100kg',
          generalDetails: 'Applied NPK fertilizer',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('type', 'Fertilizer Application');
    });

    it('should return 404 for non-existent farmer', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          farmerId: fakeId.toString(),
          type: 'Planting',
          date: '2024-01-01',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Farmer not found');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/activities')
        .send({
          farmerId: testFarmer._id.toString(),
          type: 'Weeding',
          date: '2024-01-15',
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid activity data', async () => {
      const response = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          // Missing required fields
          farmerId: testFarmer._id.toString(),
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Failed to log activity');
    });
  });

  describe('GET /api/activities/:farmerId', () => {
    it('should get activities for a farmer when authenticated', async () => {
      const response = await request(app)
        .get(`/api/activities/${testFarmer._id.toString()}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('type');
      expect(response.body[0]).toHaveProperty('farmer');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get(`/api/activities/${testFarmer._id.toString()}`);

      expect(response.status).toBe(401);
    });
  });
});