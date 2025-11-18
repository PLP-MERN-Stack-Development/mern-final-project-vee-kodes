const express = require('express');
const {registerUser, loginUser, getMe} = require('../controllers/authController.js');
const {protect, authorize} = require('../middleware/authMiddleware.js');
const router = express.Router();

router.post('/register', protect, authorize('Admin'), registerUser); 
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;