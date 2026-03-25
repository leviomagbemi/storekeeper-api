const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    quantityInStock: {
      type: Number,
      required: true,
      min: 0
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true
    },
    reorderLevel: {
      type: Number,
      required: true,
      min: 0
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    lastRestocked: {
      type: Date,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('Item', itemSchema);
