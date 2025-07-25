
// #####################################################################
// #                 Adoptly API Server - Main Entry Point             #
// #      This file configures the Express application, sets up        #
// #         middleware, and connects all the API routers.             #
// #####################################################################


//  ------------------ Imports ------------------

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors'); 
require('dotenv').config(); 


//  --- Local Module Imports ---
//  Establishes database connection as soon as the app starts

const dbConnection = require('./config/mongoose-connection');

//  --- Router Imports ---

const authRouter = require('./routes/authRouter');
const uploadRouter = require('./routes/uploadRouter'); 
const usersRouter = require('./routes/usersRouter');
const petsRouter = require('./routes/petsRouter');
const applicationRouter = require('./routes/applicationRouter');
const contactRouter = require('./routes/contactRouter');

//  --- App Initialization ---

const app = express();



// #####################################################################
// #                          Core Middleware                          #
// #####################################################################

const FRONTEND_URL = process.env.FRONTEND_URL;


// ! CRITICAL: CORS must be configured to allow requests from your React frontend.
app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin like mobile apps or curl
      if (!origin) return cb(null, true);

      // only allow the one you specified
      if (origin === FRONTEND_URL) {
        return cb(null, true);
      }
      cb(new Error(`CORS policy violation: ${origin} not allowed`));
    },
    credentials: true,
  })
);


// Middleware to parse incoming JSON payloads.
app.use(express.json());

// Middleware to parse incoming URL-encoded payloads (e.g., from HTML forms).
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies, essential for handling JWT stored in httpOnly cookies.
app.use(cookieParser());

// Serves static files (like uploaded pet images) from the 'public' directory.
app.use(express.static(path.join(__dirname, "public")));



// #####################################################################
// #                            API Routes                             #
// #####################################################################


//  A simple API "health check" route to confirm the server is running.

app.get("/api/v1", (req, res) => 
{
    res.status(200).json({ message: "Adoptly API is up and running!" });
});


// Mount the routers on their respective base paths.

// =-= All authentication-related routes are under `/api/v1/auth`
app.use("/api/v1/auth", authRouter);
app.use('/api/v1/applications', applicationRouter);
app.use('/api/v1/upload', uploadRouter); 
app.use('/api/v1/contact', contactRouter);

// =-= All user data-related routes are under `/api/v1/users`
app.use("/api/v1/users", usersRouter);

// =-= All pet-related routes are under `/api/v1/pets`
app.use("/api/v1/pets", petsRouter);





// #####################################################################
// #                     Error Handling Middleware                     #
// #####################################################################


//  --- 404 Not Found Handler ---
// ! This must be the LAST route handler. It catches any request that didn't match a route above.
app.use((req, res, next) => 
{
    res.status(404).json({ message: `Not Found - The requested URL ${req.originalUrl} does not exist.` });
});

//  --- Global Error Handler ---
// ? A more advanced implementation could log errors differently based on NODE_ENV.
app.use((err, req, res, next) => 
{
    console.error("! GLOBAL ERROR HANDLER CAUGHT AN ERROR:");
    console.error(err.stack);
    res.status(500).json({ message: "An unexpected error occurred on the server." });
});



module.exports = app;

// #####################################################################
// #                           Server Startup                          #
// #####################################################################

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`* Server is live and listening on port ${PORT}`);
//     console.log(`* API available at http://localhost:${PORT}/api/v1`);
// });