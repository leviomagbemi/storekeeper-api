const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('Supplier', supplierSchema);
