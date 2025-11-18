const express = require('express');
const {registerFarmer, getAllFarmers, getFarmerById, updateFarmer, deleteFarmer} = require('../controllers/farmerController.js');
const {protect, authorize} = require('../middleware/authMiddleware.js');
const router = express.Router();

// Admin and FieldOfficer can register and view all farmers
router
  .route('/')
  .post(protect, authorize('Admin', 'FieldOfficer'), registerFarmer)
  .get(protect, authorize('Admin', 'FieldOfficer'), getAllFarmers);

// Only Admins and Field Officers can view a specific farmer's profile.
router
  .route('/:id')
  .get(protect, authorize('Admin', 'FieldOfficer'), getFarmerById)
  .put(protect, authorize('Admin', 'FieldOfficer'), updateFarmer)    
  .delete(protect, authorize('Admin', 'FieldOfficer'), deleteFarmer); 


module.exports = router;