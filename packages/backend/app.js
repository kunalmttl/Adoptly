
// #####################################################################
// #                 Adoptly API Server - Main Entry Point             #
// #      This file configures the Express application, sets up        #
// #         middleware, and connects all the API routers.             #
// #####################################################################


//  ------------------ Imports ------------------

import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors'; 
import dotenv from 'dotenv';
dotenv.config(); 

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//  --- Local Module Imports ---
//  Establishes database connection as soon as the app starts

import dbConnection from './config/mongoose-connection.js';

//  --- Router Imports ---

import authRouter from './routes/authRouter.js';
import usersRouter from './routes/usersRouter.js';
import petsRouter from './routes/petsRouter.js';
import applicationRouter from './routes/applicationRouter.js';
import uploadRouter from './routes/uploadRouter.js'; 
import contactRouter from './routes/contactRouter.js';

//  --- App Initialization ---

const app = express();



// #####################################################################
// #                          Core Middleware                          #
// #####################################################################


// ! CRITICAL: CORS must be configured to allow requests from your React frontend.
app.use(cors({
    origin: 'http://localhost:5173', // =-= This MUST match the port your Vite/React dev server is running on.
    credentials: true // * Allows frontend to send/receive cookies for authentication.
}));


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




// #####################################################################
// #                           Server Startup                          #
// #####################################################################

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`* Server is live and listening on port ${PORT}`);
    console.log(`* API available at http://localhost:${PORT}/api/v1`);
});