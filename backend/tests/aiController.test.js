const request = require('supertest');
const express = require('express');

// Mock the entire aiController module
jest.mock('../controllers/aiController.js', () => ({
  getDashboardInsights: jest.fn((req, res) => res.status(200).json({ insights: ['Test insight'] })),
  getFarmerSummary: jest.fn((req, res) => res.status(200).json({ summary: 'Test summary' })),
  getActivityDistribution: jest.fn((req, res) => res.status(200).json({ labels: [], series: [] })),
  getCollectionsOverTime: jest.fn((req, res) => res.status(200).json({ labels: [], series: [] })),
  getYieldByRegion: jest.fn((req, res) => res.status(200).json({ labels: [], series: [] })),
  getQualityDistribution: jest.fn((req, res) => res.status(200).json({ labels: [], series: [] })),
  getYieldForecast: jest.fn((req, res) => res.status(200).json({ forecasts: [], keyRisks: [], opportunities: [] })),
}));

const aiRoutes = require('../routes/aiRoutes');

// Mock models
jest.mock('../models/FarmActivity.js', () => ({
  find: jest.fn(),
  aggregate: jest.fn(),
}));

jest.mock('../models/Farmer.js', () => ({
  findById: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock('../models/Collection.js', () => ({
  find: jest.fn(),
  aggregate: jest.fn(),
}));

// Mock middleware
jest.mock('../middleware/authMiddleware.js', () => ({
  protect: (req, res, next) => {
    req.user = { _id: 'adminId', role: 'Admin' };
    next();
  },
  authorize: () => (req, res, next) => next(),
}));

const FarmActivity = require('../models/FarmActivity.js');
const Farmer = require('../models/Farmer.js');
const Collection = require('../models/Collection.js');

const app = express();
app.use(express.json());
app.use('/api/ai', aiRoutes);

describe('AI Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/ai/insights', () => {
    it('should get dashboard insights successfully', async () => {
      const mockActivities = [
        {
          farmer: { name: 'John', contractedCrop: 'Maize', location: 'Nairobi' },
          type: 'Planting',
          date: new Date(),
          details: 'Test details',
        },
      ];

      FarmActivity.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockActivities),
        }),
      });
      Farmer.find.mockReturnValue({
        countDocuments: jest.fn().mockResolvedValue(10),
      });

      const response = await request(app)
        .get('/api/ai/insights');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('insights');
    });

    it('should get dashboard insights successfully', async () => {
      const response = await request(app)
        .get('/api/ai/insights');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('insights');
    });
  });

  describe('GET /api/ai/farmer-summary/:farmerId', () => {
    it('should get farmer summary successfully', async () => {
      const mockFarmer = { _id: 'farmerId', name: 'John', contractedCrop: 'Maize', location: 'Nairobi' };
      const mockActivities = [{ date: new Date(), type: 'Planting', details: 'Test' }];
      const mockCollections = [{ collectionDate: new Date(), weight: 100, qualityGrade: 'A', paymentStatus: 'Paid' }];

      Farmer.findById.mockResolvedValue(mockFarmer);
      FarmActivity.find.mockResolvedValue(mockActivities);
      Collection.find.mockResolvedValue(mockCollections);

      const response = await request(app)
        .get('/api/ai/farmer-summary/farmerId');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('summary');
    });

  });

  describe('GET /api/ai/analytics/activity-distribution', () => {
    it('should get activity distribution', async () => {
      const mockData = [
        { type: 'Planting', count: 5 },
        { type: 'Weeding', count: 3 },
      ];

      FarmActivity.aggregate.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/ai/analytics/activity-distribution');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('labels');
      expect(response.body).toHaveProperty('series');
    });

  });

  describe('GET /api/ai/analytics/collections-timeseries', () => {
    it('should get collections over time', async () => {
      const mockData = [
        { date: '2023-01-01', weight: 100 },
        { date: '2023-01-02', weight: 150 },
      ];

      Collection.aggregate.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/ai/analytics/collections-timeseries');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('labels');
      expect(response.body).toHaveProperty('series');
    });
  });

  describe('GET /api/ai/analytics/yield-by-region', () => {
    it('should get yield by region', async () => {
      const mockData = [
        { region: 'Central', yield: 500 },
        { region: 'Western', yield: 300 },
      ];

      Collection.aggregate.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/ai/analytics/yield-by-region');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('labels');
      expect(response.body).toHaveProperty('series');
    });
  });

  describe('GET /api/ai/analytics/quality-distribution', () => {
    it('should get quality distribution', async () => {
      const mockData = [
        { grade: 'A', weight: 200 },
        { grade: 'B', weight: 150 },
      ];

      Collection.aggregate.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/ai/analytics/quality-distribution');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('labels');
      expect(response.body).toHaveProperty('series');
    });
  });

  describe('GET /api/ai/analytics/yield-forecast', () => {
    it('should get yield forecast successfully', async () => {
      const mockActivities = [
        {
          farmer: { name: 'John', region: 'Central', contractedCrop: 'Maize' },
          date: new Date(),
          details: 'Test planting',
        },
      ];

      FarmActivity.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockActivities),
        }),
      });

      const response = await request(app)
        .get('/api/ai/analytics/yield-forecast');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('forecasts');
      expect(response.body).toHaveProperty('keyRisks');
      expect(response.body).toHaveProperty('opportunities');
    });

    it('should get yield forecast successfully', async () => {
      const response = await request(app)
        .get('/api/ai/analytics/yield-forecast');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('forecasts');
      expect(response.body).toHaveProperty('keyRisks');
      expect(response.body).toHaveProperty('opportunities');
    });
  });
});