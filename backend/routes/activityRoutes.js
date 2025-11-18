const express = require('express');
const {addActivity, getActivitiesByFarmer} = require('../controllers/activityController.js');
const {protect, authorize} = require('../middleware/authMiddleware.js');

const router = express.Router();

// Only Admins (Managers) and Field Officers can add activities.
router
    .route('/')
    .post(protect, authorize('Admin', 'FieldOfficer'), addActivity);

// All auth users (Admin, FieldOfficer) can view activities
router.route('/:farmerId').get(protect, getActivitiesByFarmer);


module.exports = router;