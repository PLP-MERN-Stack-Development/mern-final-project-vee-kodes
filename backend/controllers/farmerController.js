const Farmer = require('../models/Farmer.js');
const FarmActivity = require('../models/FarmActivity.js');
const Collection = require('../models/Collection.js');

// Register a new farmer
// POST /api/farmers
// @access  Private (Admin, FieldOfficer)
const registerFarmer = async (req, res) => {
  if (req.user.isDemo) {
    return res.status(403).json({ message: 'Demo accounts are read-only' });
  }
  const {name, region, contact, contractedCrop, contractId} = req.body;
  try {
    const farmer = await Farmer.create({
      name,
      region,
      contact,
      contractedCrop,
      contractId,
      registeredBy: req.user._id, // Set by protect middleware
    });

    // Emit real-time notification
    global.io.emit('newFarmer', {
      message: `New farmer ${farmer.name} registered`,
      farmer: {
        id: farmer._id,
        name: farmer.name,
        region: farmer.region,
        contact: farmer.contact,
      },
    });

    res.status(201).json(farmer);
  } catch (error) {
    res.status(400).json({ message: 'Invalid farmer data', error: error.message });
  }
};


// Get all farmers
// GET /api/farmers
// @access  Private (Admin, FieldOfficer)
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find({}).populate('registeredBy', 'name');
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


// Get single farmer details (profile)
// GET /api/farmers/:id
// @access  Private
const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id).populate(
      'registeredBy',
      'name'
    );

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Get associated activities and collections
    const activities = await FarmActivity.find({farmer: farmer._id}).sort({
      date: -1,
    });
    const collections = await Collection.find({farmer: farmer._id}).sort({
      collectionDate: -1,
    });

    res.status(200).json({farmer, activities, collections});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


// Update a farmer's details
// PUT /api/farmers/:id
// @access  Private (Admin, FieldOfficer)
const updateFarmer = async (req, res) => {
  if (req.user.isDemo) {
    return res.status(403).json({ message: 'Demo accounts are read-only' });
  }
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    // Only Admin or the FieldOfficer who registered the farmer can update
    if (
      req.user.role !== 'Admin' &&
      farmer.registeredBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'User not authorized to update this farmer' });
    }
    // Update fields
    farmer.name = req.body.name || farmer.name;
    farmer.region = req.body.region || farmer.region;
    farmer.contact = req.body.contact || farmer.contact;
    farmer.contractedCrop = req.body.contractedCrop || farmer.contractedCrop;
    farmer.contractId = req.body.contractId || farmer.contractId;

    const updatedFarmer = await farmer.save();
    res.status(200).json(updatedFarmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a farmer
// DELETE /api/farmers/:id
// @access  Private (Admin, FieldOfficer)
const deleteFarmer = async (req, res) => {
  if (req.user.isDemo) {
    return res.status(403).json({ message: 'Demo accounts are read-only' });
  }
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    // Only Admin or the FieldOfficer who registered the farmer can delete
    if (
      req.user.role !== 'Admin' &&
      farmer.registeredBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'User not authorized to delete this farmer' });
    }
    // Before deleting the farmer, delete all associated data
    await FarmActivity.deleteMany({farmer: farmer._id});
    await Collection.deleteMany({farmer: farmer._id});
    // Now delete the farmer
    await Farmer.deleteOne({ _id: farmer._id });

    res.status(200).json({ message: 'Farmer and all associated data removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {registerFarmer, getAllFarmers, getFarmerById, updateFarmer, deleteFarmer};