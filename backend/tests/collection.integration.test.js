// Set up global mocks before importing
global.io = { emit: jest.fn() };

const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Collection = require('../models/Collection');

// Import the app after setting up mocks
const app = require('../server');

describe('Collection Integration Tests', () => {
  let adminToken;
  let fieldOfficerToken;
  let adminUser;
  let fieldOfficerUser;
  let testFarmer;
  let testCollection;

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

    // Create a test collection
    testCollection = await Collection.create({
      farmer: testFarmer._id,
      crop: 'Maize',
      harvestDate: new Date(),
      collectionDate: new Date(),
      weight: 100,
      qualityGrade: 'A',
      paymentRate: 50,
      totalPayment: 5000,
      recordedBy: adminUser._id,
      paymentStatus: 'Pending',
    });
  });

  describe('POST /api/collections', () => {
    it('should record a collection when authenticated as admin', async () => {
      const response = await request(app)
        .post('/api/collections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          farmerId: testFarmer._id.toString(),
          crop: 'Coffee',
          harvestDate: '2024-01-15',
          collectionDate: '2024-01-20',
          weight: 200,
          qualityGrade: 'B',
          paymentRate: 60,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('crop', 'Coffee');
      expect(response.body).toHaveProperty('weight', 200);
      expect(response.body).toHaveProperty('totalPayment', 12000); // 200 * 60
    });

    it('should record a collection when authenticated as field officer', async () => {
      const response = await request(app)
        .post('/api/collections')
        .set('Authorization', `Bearer ${fieldOfficerToken}`)
        .send({
          farmerId: testFarmer._id.toString(),
          crop: 'Tea',
          harvestDate: '2024-02-01',
          collectionDate: '2024-02-05',
          weight: 150,
          qualityGrade: 'A',
          paymentRate: 70,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('crop', 'Tea');
      expect(response.body).toHaveProperty('totalPayment', 10500); // 150 * 70
    });

    it('should return 404 for non-existent farmer', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post('/api/collections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          farmerId: fakeId.toString(),
          crop: 'Maize',
          harvestDate: '2024-01-01',
          collectionDate: '2024-01-02',
          weight: 100,
          qualityGrade: 'A',
          paymentRate: 50,
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Farmer not found');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/collections')
        .send({
          farmerId: testFarmer._id.toString(),
          crop: 'Maize',
          harvestDate: '2024-01-01',
          collectionDate: '2024-01-02',
          weight: 100,
          qualityGrade: 'A',
          paymentRate: 50,
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid collection data', async () => {
      const response = await request(app)
        .post('/api/collections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          // Missing required fields
          farmerId: testFarmer._id.toString(),
          crop: 'Maize',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid collection data');
    });
  });

  describe('PUT /api/collections/:id/pay', () => {
    it('should update payment status when authenticated as admin', async () => {
      const response = await request(app)
        .put(`/api/collections/${testCollection._id.toString()}/pay`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('paymentStatus', 'Paid');
      expect(response.body).toHaveProperty('paymentDate');
    });

    it('should return 404 for non-existent collection', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/collections/${fakeId.toString()}/pay`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Collection record not found');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .put(`/api/collections/${testCollection._id.toString()}/pay`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/collections', () => {
    it('should get all collections when authenticated as admin', async () => {
      const response = await request(app)
        .get('/api/collections')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/collections');

      expect(response.status).toBe(401);
    });
  });
});