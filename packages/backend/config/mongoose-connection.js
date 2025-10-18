// set DEBUG=development:*
// change environment variable and set to development for this to run


// #####################################################################
// #                 Mongoose Database Connection Module               #
// #####################################################################


// * ------------------ Imports ------------------

const mongoose = require('mongoose');
const dbgr = require('debug')('development:mongoose');       //  For logging connection status.

// =-= Using an immediately-invoked async function (IIFE) to connect.*
(async () => 
{
  try 
  {
    // Get the MongoDB URI directly from environment variables.
    const mongoURI = process.env.MONGODB_URI;

    // ! Make sure MONGODB_URI is defined in your .env file!
    if (!mongoURI) 
    {
        dbgr('! ERROR: MONGODB_URI is not defined in the .env file.');
        process.exit(1); // * Exit the application if the DB connection string is missing.
    }

    // Await the connection to the database.
    await mongoose.connect(mongoURI);
    dbgr('* MongoDB Connected Successfully.');

  } 
  catch (err) 
  {
    // Log any errors that occur during the connection process.
    dbgr('! ERROR: Could not connect to MongoDB.', err.message);
    process.exit(1); // * Exit the application on a connection failure.
  }
})();

// * Export the Mongoose connection object for use in other parts of the application.
module.exports = mongoose.connection;