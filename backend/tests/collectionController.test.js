const request = require('supertest');
const express = require('express');
const collectionRoutes = require('../routes/collectionRoutes');

// Mock models
jest.mock('../models/Collection.js', () => ({
  create: jest.fn(),
  findById: jest.fn(),
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

const Collection = require('../models/Collection.js');
const Farmer = require('../models/Farmer.js');

const app = express();
app.use(express.json());
app.use('/api/collections', collectionRoutes);

describe('Collection Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/collections', () => {
    it('should record collection successfully', async () => {
      const collectionData = {
        farmerId: 'farmerId',
        crop: 'Maize',
        harvestDate: '2023-01-01',
        collectionDate: '2023-01-02',
        weight: 100,
        qualityGrade: 'A',
        paymentRate: 50,
      };

      const mockFarmer = { _id: 'farmerId', name: 'John Farmer' };
      const mockCollection = {
        _id: 'collectionId',
        ...collectionData,
        farmer: 'farmerId',
        recordedBy: 'userId',
        totalPayment: 5000,
        paymentStatus: 'Pending',
      };

      Farmer.findById.mockResolvedValue(mockFarmer);
      Collection.create.mockResolvedValue(mockCollection);

      const response = await request(app)
        .post('/api/collections')
        .send(collectionData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCollection);
      expect(Collection.create).toHaveBeenCalledWith({
        farmer: 'farmerId',
        crop: 'Maize',
        harvestDate: '2023-01-01',
        collectionDate: '2023-01-02',
        weight: 100,
        qualityGrade: 'A',
        paymentRate: 50,
        totalPayment: 5000,
        recordedBy: 'userId',
        paymentStatus: 'Pending',
      });
    });

    it('should return 403 for demo accounts', async () => {
      const { protect } = require('../middleware/authMiddleware.js');
      protect.mockImplementationOnce((req, res, next) => {
        req.user = { _id: 'userId', role: 'FieldOfficer', isDemo: true };
        next();
      });

      const response = await request(app)
        .post('/api/collections')
        .send({});

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Demo accounts are read-only');
    });

    it('should return 404 if farmer not found', async () => {
      Farmer.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/collections')
        .send({ farmerId: 'invalidId' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Farmer not found');
    });

    it('should return 400 for invalid collection data', async () => {
      const mockFarmer = { _id: 'farmerId', name: 'John Farmer' };
      Farmer.findById.mockResolvedValue(mockFarmer);

      const response = await request(app)
        .post('/api/collections')
        .send({ farmerId: 'farmerId', weight: 'invalid', paymentRate: 10 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid weight value');
    });
  });

  describe('PUT /api/collections/:id/pay', () => {
    it('should update payment status successfully', async () => {
      const mockCollection = {
        _id: 'collectionId',
        paymentStatus: 'Pending',
        save: jest.fn().mockResolvedValue({
          _id: 'collectionId',
          paymentStatus: 'Paid',
          paymentDate: expect.any(Date),
        }),
      };

      Collection.findById.mockResolvedValue(mockCollection);

      const response = await request(app)
        .put('/api/collections/collectionId/pay');

      expect(response.status).toBe(200);
      expect(response.body.paymentStatus).toBe('Paid');
      expect(mockCollection.save).toHaveBeenCalled();
    });

    it('should return 403 for demo accounts', async () => {
      const { protect } = require('../middleware/authMiddleware.js');
      protect.mockImplementationOnce((req, res, next) => {
        req.user = { _id: 'userId', role: 'Admin', isDemo: true };
        next();
      });

      const response = await request(app)
        .put('/api/collections/collectionId/pay');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Demo accounts are read-only');
    });

    it('should return 404 if collection not found', async () => {
      Collection.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/collections/invalidId/pay');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Collection record not found');
    });
  });

  describe('GET /api/collections', () => {
    it('should get all collections', async () => {
      const mockCollections = [
        { _id: 'collection1', crop: 'Maize', farmer: { name: 'Farmer 1' } },
        { _id: 'collection2', crop: 'Rice', farmer: { name: 'Farmer 2' } },
      ];

      Collection.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockCollections),
        }),
      });

      const response = await request(app)
        .get('/api/collections');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCollections);
    });

    it('should return 500 on error', async () => {
      Collection.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error('DB error')),
        }),
      });

      const response = await request(app)
        .get('/api/collections');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });
});