const express = require('express');
const {recordCollection, updatePaymentStatus, getAllCollections} = require('../controllers/collectionController.js');
const {protect, authorize} = require('../middleware/authMiddleware.js');

const router = express.Router();

// Admin and FieldOfficer can record produce collections
router
  .route('/')
  .post(protect, authorize('Admin', 'FieldOfficer'), recordCollection)
  .get(protect, authorize('Admin'), getAllCollections); // Admin-only dashboard route

// Admin can mark as paid
router
  .route('/:id/pay')
  .put(protect, authorize('Admin'), updatePaymentStatus);

module.exports = router;