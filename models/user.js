const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true
    },
    password: {
      type: String
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true
    },
    provider: {
      type: String,
      enum: ['local', 'github'],
      default: 'local'
    },
    displayName: {
      type: String,
      trim: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
