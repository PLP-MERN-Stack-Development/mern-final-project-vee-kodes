const request = require('supertest');
const express = require('express');
const farmerRoutes = require('../routes/farmerRoutes');

// Mock models
jest.mock('../models/Farmer.js', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  deleteOne: jest.fn(),
}));

jest.mock('../models/FarmActivity.js', () => ({
  find: jest.fn(),
  deleteMany: jest.fn(),
}));

jest.mock('../models/Collection.js', () => ({
  find: jest.fn(),
  deleteMany: jest.fn(),
}));

// Mock middleware
jest.mock('../middleware/authMiddleware.js', () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { _id: 'userId', role: 'FieldOfficer', isDemo: false };
    next();
  }),
  authorize: () => (req, res, next) => next(),
}));

const Farmer = require('../models/Farmer.js');
const FarmActivity = require('../models/FarmActivity.js');
const Collection = require('../models/Collection.js');

const app = express();
app.use(express.json());
app.use('/api/farmers', farmerRoutes);

describe('Farmer Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/farmers', () => {
    it('should register a new farmer successfully', async () => {
      const farmerData = {
        name: 'John Farmer',
        region: 'Central',
        contact: '123456789',
        contractedCrop: 'Maize',
        contractId: 'CON001',
      };

      const mockFarmer = {
        _id: 'farmerId',
        ...farmerData,
        registeredBy: 'userId',
      };

      Farmer.create.mockResolvedValue(mockFarmer);

      const response = await request(app)
        .post('/api/farmers')
        .send(farmerData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockFarmer);
      expect(Farmer.create).toHaveBeenCalledWith({
        ...farmerData,
        registeredBy: 'userId',
      });
    });

    it('should return 403 for demo accounts', async () => {
      const { protect } = require('../middleware/authMiddleware.js');
      protect.mockImplementationOnce((req, res, next) => {
        req.user = { _id: 'userId', role: 'FieldOfficer', isDemo: true };
        next();
      });

      const response = await request(app)
        .post('/api/farmers')
        .send({});

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Demo accounts are read-only');
    });

    it('should return 400 for invalid farmer data', async () => {
      Farmer.create.mockRejectedValue(new Error('Validation error'));

      const response = await request(app)
        .post('/api/farmers')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/farmers', () => {
    it('should get all farmers', async () => {
      const mockFarmers = [
        { _id: 'farmer1', name: 'Farmer 1', registeredBy: { name: 'User 1' } },
        { _id: 'farmer2', name: 'Farmer 2', registeredBy: { name: 'User 2' } },
      ];

      Farmer.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockFarmers),
      });

      const response = await request(app)
        .get('/api/farmers');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFarmers);
    });

    it('should return 500 on error', async () => {
      Farmer.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('DB error')),
      });

      const response = await request(app)
        .get('/api/farmers');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/farmers/:id', () => {
    it('should return 404 if farmer not found', async () => {
      Farmer.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const response = await request(app)
        .get('/api/farmers/invalidId');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Farmer not found');
    });
  });

  describe('PUT /api/farmers/:id', () => {
    it('should update farmer successfully', async () => {
      const updateData = { name: 'Updated Name' };
      const mockFarmer = {
        _id: 'farmerId',
        name: 'Old Name',
        registeredBy: 'userId',
        save: jest.fn().mockResolvedValue({ _id: 'farmerId', name: 'Updated Name', registeredBy: 'userId' }),
      };

      Farmer.findById.mockResolvedValue(mockFarmer);

      const response = await request(app)
        .put('/api/farmers/farmerId')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
    });

    it('should return 403 for demo accounts', async () => {
      const { protect } = require('../middleware/authMiddleware.js');
      protect.mockImplementationOnce((req, res, next) => {
        req.user = { _id: 'userId', role: 'FieldOfficer', isDemo: true };
        next();
      });

      const response = await request(app)
        .put('/api/farmers/farmerId')
        .send({});

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Demo accounts are read-only');
    });

    it('should return 404 if farmer not found', async () => {
      Farmer.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/farmers/invalidId')
        .send({ name: 'New Name' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Farmer not found');
    });

    it('should return 403 if not authorized', async () => {
      const mockFarmer = {
        _id: 'farmerId',
        registeredBy: 'otherUserId',
      };

      Farmer.findById.mockResolvedValue(mockFarmer);

      const response = await request(app)
        .put('/api/farmers/farmerId')
        .send({ name: 'New Name' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'User not authorized to update this farmer');
    });
  });

  describe('DELETE /api/farmers/:id', () => {
    it('should delete farmer successfully', async () => {
      const mockFarmer = {
        _id: 'farmerId',
        registeredBy: 'userId',
      };

      Farmer.findById.mockResolvedValue(mockFarmer);
      FarmActivity.deleteMany.mockResolvedValue({});
      Collection.deleteMany.mockResolvedValue({});
      Farmer.deleteOne.mockResolvedValue({});

      const response = await request(app)
        .delete('/api/farmers/farmerId');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Farmer and all associated data removed');
      expect(FarmActivity.deleteMany).toHaveBeenCalledWith({ farmer: 'farmerId' });
      expect(Collection.deleteMany).toHaveBeenCalledWith({ farmer: 'farmerId' });
    });

    it('should return 403 for demo accounts', async () => {
      const { protect } = require('../middleware/authMiddleware.js');
      protect.mockImplementationOnce((req, res, next) => {
        req.user = { _id: 'userId', role: 'FieldOfficer', isDemo: true };
        next();
      });

      const response = await request(app)
        .delete('/api/farmers/farmerId');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Demo accounts are read-only');
    });

    it('should return 404 if farmer not found', async () => {
      Farmer.findById.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/farmers/invalidId');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Farmer not found');
    });
  });
});