const mongoose = require('mongoose');

const collectionSchema = mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    crop: {
      type: String,
      required: true,
    },
    harvestDate: {
      type: Date,
      required: true,
    },
    collectionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    weight: {
      type: Number, // in Kgs
      required: true,
    },
    qualityGrade: {
      type: String,
      enum: ['A', 'B', 'C', 'Reject'],
      required: true,
    },
    paymentRate: {
      type: Number, // Price per Kg
      required: true,
    },
    totalPayment: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
    paymentDate: {
      type: Date,
    },
    // User who recorded this collection
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;