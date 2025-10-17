// packages/backend/config/mongoose-connection.js

const mongoose = require('mongoose');
const debug = require('debug')('development:mongoose');

// Immediately connect to MongoDB when this module is imported.
(async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      debug('Error: MONGODB_URI is not defined in the .env file.');
      process.exit(1); // Exit if DB connection string is missing.
    }

    await mongoose.connect(mongoURI);
    debug('MongoDB connected successfully.');

  } catch (error) {
    debug('Error: Could not connect to MongoDB.', error.message);
    process.exit(1); // Exit on connection failure.
  }
})();

// Export the Mongoose connection object.
module.exports = mongoose.connection;