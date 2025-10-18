// packages/backend/config/db.js
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() 
{
  if (!MONGODB_URI) throw new Error('MONGODB_URI not set');

  // Use a global cache to reuse connection between lambda invocations
  if (global._mongoConnection && mongoose.connection.readyState === 1) {
    return global._mongoConnection;
  }

  // If a connection promise exists, return it (prevents duplicate connects)
  if (global._mongoConnectPromise) {
    await global._mongoConnectPromise;
    return mongoose.connection;
  }

  global._mongoConnectPromise = mongoose.connect(MONGODB_URI, {
    // recommended options if any; mongoose 6+ auto handles most
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  await global._mongoConnectPromise;
  global._mongoConnection = mongoose.connection;
  return global._mongoConnection;
}

module.exports = { connectDB };
