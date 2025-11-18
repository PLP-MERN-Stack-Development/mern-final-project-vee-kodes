const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const Farmer = require('../models/Farmer');

// Import the app after setting up mocks
const app = require('../server');

describe('Farmer Integration Tests', () => {
  let adminToken;
  let fieldOfficerToken;
  let adminUser;
  let fieldOfficerUser;
  let testFarmer;

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

    // Get tokens by mocking login
    adminToken = 'token'; // Mocked token
    fieldOfficerToken = 'token'; // Mocked token

    // Create a test farmer for tests that need it
    testFarmer = await Farmer.create({
      name: 'Test Farmer',
      region: 'Nairobi',
      contact: '+254712345678',
      contractedCrop: 'Maize',
      contractId: 'TEST001',
      registeredBy: adminUser._id,
    });
  });

  describe('POST /api/farmers', () => {
    it('should create a farmer when authenticated as admin', async () => {
      const response = await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'John Doe',
          region: 'Nairobi',
          contact: '+254712345678',
          contractedCrop: 'Maize',
          contractId: 'CONTRACT001',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', 'John Doe');
      expect(response.body).toHaveProperty('region', 'Nairobi');
      expect(response.body).toHaveProperty('contractedCrop', 'Maize');

      testFarmer = response.body;
    });

    it('should create a farmer when authenticated as field officer', async () => {
      const response = await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${fieldOfficerToken}`)
        .send({
          name: 'Jane Smith',
          region: 'Central',
          contact: '+254798765432',
          contractedCrop: 'Coffee',
          contractId: 'CONTRACT002',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Jane Smith');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/farmers')
        .send({
          name: 'Unauthorized Farmer',
          region: 'Nairobi',
          contact: '+254711111111',
          contractedCrop: 'Maize',
          contractId: 'CONTRACT003',
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid farmer data', async () => {
      const response = await request(app)
        .post('/api/farmers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          // Missing required fields
          name: 'Invalid Farmer',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid farmer data');
    });
  });

  describe('GET /api/farmers', () => {
    it('should get all farmers when authenticated as admin', async () => {
      const response = await request(app)
        .get('/api/farmers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get all farmers when authenticated as field officer', async () => {
      const response = await request(app)
        .get('/api/farmers')
        .set('Authorization', `Bearer ${fieldOfficerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/farmers');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/farmers/:id', () => {
    it('should get farmer by id', async () => {
      const response = await request(app)
        .get(`/api/farmers/${testFarmer._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('farmer');
      expect(response.body.farmer).toHaveProperty('_id', testFarmer._id.toString());
      expect(response.body).toHaveProperty('activities');
      expect(response.body).toHaveProperty('collections');
    });

    it('should return 404 for non-existent farmer', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/farmers/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Farmer not found');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get(`/api/farmers/${testFarmer._id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/farmers/:id', () => {
    it('should update farmer when authenticated as admin', async () => {
      const response = await request(app)
        .put(`/api/farmers/${testFarmer._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'John Doe Updated',
          region: 'Rift Valley',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'John Doe Updated');
      expect(response.body).toHaveProperty('region', 'Nakuru');
    });

    it('should return 404 for non-existent farmer', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/farmers/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Non-existent Farmer',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Farmer not found');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .put(`/api/farmers/${testFarmer._id}`)
        .send({
          name: 'Unauthorized Update',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/farmers/:id', () => {
    it('should delete farmer when authenticated as admin', async () => {
      const response = await request(app)
        .delete(`/api/farmers/${testFarmer._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Farmer and all associated data removed');
    });

    it('should return 404 for non-existent farmer', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/farmers/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Farmer not found');
    });

    it('should return 401 when not authenticated', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/farmers/${fakeId}`);

      expect(response.status).toBe(401);
    });
  });
});