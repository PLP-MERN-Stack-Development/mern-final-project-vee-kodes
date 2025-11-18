const Collection = require('../models/Collection.js');
const Farmer = require('../models/Farmer.js');

// Record a new farm produce collection
// POST /api/collections
// @access  Private (Admin, FieldOfficer)
const recordCollection = async (req, res) => {
  if (req.user.isDemo) {
    return res.status(403).json({ message: 'Demo accounts are read-only' });
  }
  const {
    farmerId,
    crop,
    harvestDate,
    collectionDate,
    weight,
    qualityGrade,
    paymentRate,
  } = req.body;

  try {
    // Check if farmer exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Validate numeric inputs
    const weightNum = parseFloat(weight);
    const paymentRateNum = parseFloat(paymentRate);
    if (isNaN(weightNum) || weightNum <= 0) {
      return res.status(400).json({ message: 'Invalid weight value' });
    }
    if (isNaN(paymentRateNum) || paymentRateNum <= 0) {
      return res.status(400).json({ message: 'Invalid payment rate value' });
    }

    // Calculate total payment
    const totalPayment = weightNum * paymentRateNum;

    const collection = await Collection.create({
      farmer: farmerId,
      crop,
      harvestDate,
      collectionDate,
      weight,
      qualityGrade,
      paymentRate,
      totalPayment,
      recordedBy: req.user._id,
      paymentStatus: 'Pending', // Default
    });

    // Emit real-time notification (skip in test environment)
    if (process.env.NODE_ENV !== 'test') {
      global.io.emit('newCollection', {
        message: `New ${collection.crop} collection recorded for farmer ${farmer.name}`,
        collection: {
          id: collection._id,
          crop: collection.crop,
          farmer: farmer.name,
          weight: collection.weight,
          collectionDate: collection.collectionDate,
        },
      });
    }

    res.status(201).json(collection);
  } catch (error) {
    res.status(400).json({ message: 'Invalid collection data', error: error.message });
  }
};


// Update collection payment status
// PUT /api/collections/:id/pay
// @access  Private (Admin)
const updatePaymentStatus = async (req, res) => {
  if (req.user.isDemo) {
    return res.status(403).json({ message: 'Demo accounts are read-only' });
  }
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection record not found' });
    }
    collection.paymentStatus = 'Paid';
    collection.paymentDate = Date.now();

    const updatedCollection = await collection.save();
    res.status(200).json(updatedCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all collections
// GET /api/collections
// @access  Private (Admin)
const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find({})
      .populate('farmer', 'name location')
      .sort({ collectionDate: -1 });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {recordCollection, updatePaymentStatus, getAllCollections};
