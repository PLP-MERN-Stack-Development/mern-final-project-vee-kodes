const request = require('supertest');
const express = require('express');
const activityRoutes = require('../routes/activityRoutes');

// Mock models
jest.mock('../models/FarmActivity.js', () => ({
  create: jest.fn(),
  find: jest.fn(),
}));

jest.mock('../models/Farmer.js', () => ({
  findById: jest.fn(),
}));

// Mock middleware
jest.mock('../middleware/authMiddleware.js', () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { _id: 'userId', role: 'FieldOfficer', isDemo: false };
    next();
  }),
  authorize: () => (req, res, next) => next(),
}));

const FarmActivity = require('../models/FarmActivity.js');
const Farmer = require('../models/Farmer.js');

const app = express();
app.use(express.json());
app.use('/api/activities', activityRoutes);

describe('Activity Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/activities', () => {
    it('should add activity successfully', async () => {
      const activityData = {
        farmerId: 'farmerId',
        type: 'Planting',
        date: '2023-01-01',
        cost: 100,
        seedVariety: 'Maize Seed',
      };

      const mockFarmer = { _id: 'farmerId', name: 'John Farmer' };
      const mockActivity = {
        _id: 'activityId',
        ...activityData,
        farmer: 'farmerId',
        recordedBy: 'userId',
      };

      Farmer.findById.mockResolvedValue(mockFarmer);
      FarmActivity.create.mockResolvedValue(mockActivity);

      const response = await request(app)
        .post('/api/activities')
        .send(activityData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockActivity);
      expect(FarmActivity.create).toHaveBeenCalledWith({
        farmer: 'farmerId',
        recordedBy: 'userId',
        type: 'Planting',
        date: '2023-01-01',
        cost: 100,
        seedVariety: 'Maize Seed',
      });
    });

    it('should return 403 for demo accounts', async () => {
      const { protect } = require('../middleware/authMiddleware.js');
      protect.mockImplementationOnce((req, res, next) => {
        req.user = { _id: 'userId', role: 'FieldOfficer', isDemo: true };
        next();
      });

      const response = await request(app)
        .post('/api/activities')
        .send({});

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Demo accounts are read-only');
    });

    it('should return 404 if farmer not found', async () => {
      Farmer.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/activities')
        .send({ farmerId: 'invalidId' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Farmer not found');
    });

    it('should return 400 for invalid activity data', async () => {
      const mockFarmer = { _id: 'farmerId', name: 'John Farmer' };
      Farmer.findById.mockResolvedValue(mockFarmer);
      FarmActivity.create.mockRejectedValue(new Error('Validation error'));

      const response = await request(app)
        .post('/api/activities')
        .send({ farmerId: 'farmerId' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Failed to log activity');
    });
  });

  describe('GET /api/activities/:farmerId', () => {
    it('should get activities by farmer', async () => {
      const mockActivities = [
        { _id: 'activity1', type: 'Planting', recordedBy: { name: 'User' } },
        { _id: 'activity2', type: 'Weeding', recordedBy: { name: 'User' } },
      ];

      FarmActivity.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockActivities),
        }),
      });

      const response = await request(app)
        .get('/api/activities/507f1f77bcf86cd799439011');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockActivities);
      expect(FarmActivity.find).toHaveBeenCalledWith({ farmer: '507f1f77bcf86cd799439011' });
    });

    it('should return 500 on error', async () => {
      FarmActivity.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error('DB error')),
        }),
      });

      const response = await request(app)
        .get('/api/activities/507f1f77bcf86cd799439011');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });
});