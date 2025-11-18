const mongoose = require('mongoose');

const farmerRegions = [
  'Central',
  'Coast',
  'Eastern',
  'Nairobi',
  'North Eastern',
  'Nyanza',
  'Rift Valley',
  'Western',
];

const farmerSchema = mongoose.Schema(
  {
    // Field Officer who registered this farmer
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
      enum: farmerRegions, 
    },
    contact: {
      type: String,
      required: true,
    },
    contractedCrop: {
      type: String,
      required: true,
    },
    contractId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Farmer = mongoose.model('Farmer', farmerSchema);
module.exports = Farmer;