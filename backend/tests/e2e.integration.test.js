// Set up global mocks before importing
global.io = { emit: jest.fn() };

const request = require('supertest');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const FarmActivity = require('../models/FarmActivity');
const Collection = require('../models/Collection');

// Import the app after setting up mocks
const app = require('../server');

describe('End-to-End Integration Test', () => {
  let adminToken;
  let fieldOfficerToken;
  let farmerId;
  let activityId;
  let collectionId;

  it('should complete full workflow: register user -> login -> create farmer -> log activity -> record collection', async () => {
    // Step 1: Register a new field officer (as admin)
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@system.com',
      password: 'hashedpassword',
      role: 'Admin',
      isDemo: false,
    });

    // Mock admin login
    adminToken = 'token';

    // Register a field officer
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'John Field Officer',
        email: 'john@field.com',
        password: 'password123',
        role: 'FieldOfficer',
      });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body).toHaveProperty('email', 'john@field.com');

    // Step 2: Login as the field officer
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@field.com',
        password: 'password123',
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    fieldOfficerToken = loginResponse.body.token;

    // Step 3: Create a farmer
    const farmerResponse = await request(app)
      .post('/api/farmers')
      .set('Authorization', `Bearer ${fieldOfficerToken}`)
      .send({
        name: 'Alice Johnson',
        region: 'Nairobi',
        contact: '+254712345678',
        contractedCrop: 'Maize',
        contractId: 'CONTRACT2024',
      });

    expect(farmerResponse.status).toBe(201);
    expect(farmerResponse.body).toHaveProperty('name', 'Alice Johnson');
    farmerId = farmerResponse.body._id;

    // Step 4: Log a farm activity
    const activityResponse = await request(app)
      .post('/api/activities')
      .set('Authorization', `Bearer ${fieldOfficerToken}`)
      .send({
        farmerId: farmerId,
        type: 'Planting',
        date: '2024-01-15',
        cost: 1500,
        seedVariety: 'Hybrid Maize',
        seedSource: 'Local Supplier',
        seedQuantity: 100,
        generalDetails: 'Planted hybrid maize seeds in prepared field',
      });

    expect(activityResponse.status).toBe(201);
    expect(activityResponse.body).toHaveProperty('type', 'Planting');
    expect(activityResponse.body).toHaveProperty('cost', 1500);
    activityId = activityResponse.body._id;

    // Step 5: Record a collection
    const collectionResponse = await request(app)
      .post('/api/collections')
      .set('Authorization', `Bearer ${fieldOfficerToken}`)
      .send({
        farmerId: farmerId,
        crop: 'Maize',
        harvestDate: '2024-06-15',
        collectionDate: '2024-06-20',
        weight: 250,
        qualityGrade: 'A',
        paymentRate: 55,
      });

    expect(collectionResponse.status).toBe(201);
    expect(collectionResponse.body).toHaveProperty('crop', 'Maize');
    expect(collectionResponse.body).toHaveProperty('weight', 250);
    expect(collectionResponse.body).toHaveProperty('totalPayment', 13750); // 250 * 55
    collectionId = collectionResponse.body._id;

    // Step 6: Verify farmer profile includes activities and collections
    const farmerProfileResponse = await request(app)
      .get(`/api/farmers/${farmerId}`)
      .set('Authorization', `Bearer ${fieldOfficerToken}`);

    expect(farmerProfileResponse.status).toBe(200);
    expect(farmerProfileResponse.body.farmer).toHaveProperty('name', 'Alice Johnson');
    expect(farmerProfileResponse.body.activities).toHaveLength(1);
    expect(farmerProfileResponse.body.collections).toHaveLength(1);
    expect(farmerProfileResponse.body.activities[0]).toHaveProperty('type', 'Planting');
    expect(farmerProfileResponse.body.collections[0]).toHaveProperty('crop', 'Maize');

    // Step 7: Update payment status (as admin)
    const paymentResponse = await request(app)
      .put(`/api/collections/${collectionId}/pay`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(paymentResponse.status).toBe(200);
    expect(paymentResponse.body).toHaveProperty('paymentStatus', 'Paid');
    expect(paymentResponse.body).toHaveProperty('paymentDate');

    // Step 8: Get user profile
    const profileResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${fieldOfficerToken}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toHaveProperty('name', 'John Field Officer');
    expect(profileResponse.body).toHaveProperty('role', 'FieldOfficer');

    // Step 9: Get all farmers (as field officer)
    const farmersResponse = await request(app)
      .get('/api/farmers')
      .set('Authorization', `Bearer ${fieldOfficerToken}`);

    expect(farmersResponse.status).toBe(200);
    expect(Array.isArray(farmersResponse.body)).toBe(true);
    expect(farmersResponse.body.length).toBeGreaterThan(0);

    // Step 10: Get activities for the farmer
    const activitiesResponse = await request(app)
      .get(`/api/activities/${farmerId}`)
      .set('Authorization', `Bearer ${fieldOfficerToken}`);

    expect(activitiesResponse.status).toBe(200);
    expect(Array.isArray(activitiesResponse.body)).toBe(true);
    expect(activitiesResponse.body.length).toBeGreaterThan(0);

    // Step 11: Get all collections (as admin)
    const collectionsResponse = await request(app)
      .get('/api/collections')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(collectionsResponse.status).toBe(200);
    expect(Array.isArray(collectionsResponse.body)).toBe(true);
    expect(collectionsResponse.body.length).toBeGreaterThan(0);
  });
});