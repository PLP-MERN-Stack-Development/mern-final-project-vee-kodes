const mongoose = require('mongoose');

const farmActivitySchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    // User who recorded this (FieldOfficer)
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'Planting',
        'Fertilizer Application',
        'Pesticide Application',
        'Pest Control',
        'Weeding',
        'Irrigation',
        'Field Maintenance/General Maintenance',
      ],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    cost: {
      type: Number,
      required: false,
      default: 0,
    },

    // Planting fields
    seedVariety: { type: String },
    seedSource: { type: String },
    seedQuantity: { type: String },
    seedLotNumber: { type: String },

    // Fertilizer fields
    fertilizerType: { type: String },
    fertilizerAmount: { type: String },

    // Pesticide fields
    pesticideType: { type: String },
    pesticideAmount: { type: String },

    // Pest Control fields
    pestControlMethod: { type: String },
    pestTarget: { type: String },

    // General details for other operations
    generalDetails: { type: String },
  },
  {
    timestamps: true,
  }
);

const FarmActivity = mongoose.model('FarmActivity', farmActivitySchema);
module.exports = FarmActivity;
