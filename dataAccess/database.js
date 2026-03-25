const mongoose = require('mongoose');

const connectDatabase = async () => {
  const { MONGODB_URI, DB_NAME } = process.env;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is required.');
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: DB_NAME || 'storekeeper'
  });
};

module.exports = connectDatabase;
