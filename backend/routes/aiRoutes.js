const express = require('express');
const {getDashboardInsights, 
  getFarmerSummary, 
  getActivityDistribution,
  getCollectionsOverTime,
  getYieldByRegion,
  getQualityDistribution,
  getYieldForecast
} = require('../controllers/aiController.js');
const {protect, authorize} = require('../middleware/authMiddleware.js');

const router = express.Router();

// Admin-only route for dashboard insights
// GET /api/ai/insights
// Gets the main dashboard qualitative summary
router
  .route('/insights')
  .get(protect, authorize('Admin'), getDashboardInsights);


// Admin route for specific farmer summary
// GET /api/ai/farmer-summary/:farmerId
// Gets a qualitative summary for a single farmer
router
    .route('/farmer-summary/:farmerId')
    .get(protect, authorize('Admin', 'FieldOfficer'), getFarmerSummary);


// GET /api/ai/analytics/activity-distribution
// Gets data for the "Activity Types" Pie Chart
router
  .route('/analytics/activity-distribution')
  .get(protect, authorize('Admin'), getActivityDistribution);


// GET /api/ai/analytics/collections-timeseries
// Gets data for the "Collections Over Time" Line Chart
router
.route('/analytics/collections-timeseries')
.get(protect, authorize('Admin'), getCollectionsOverTime);


// GET /api/ai/analytics/yield-by-region
// Gets data for the "Yield by Region" Bar Chart
router
.route('/analytics/yield-by-region')
.get( protect, authorize('Admin'), getYieldByRegion);


// GET /api/ai/analytics/quality-distribution
// Gets data for the "Quality Grade" Pie Chart
router
  .route('/analytics/quality-distribution')
  .get(protect, authorize('Admin'), getQualityDistribution);



// GET /api/ai/analytics/yield-forecast
// Gets AI-driven predictive insights on future harvests
router
  .route('/analytics/yield-forecast')
  .get(protect, authorize('Admin'), getYieldForecast);


module.exports = router;