
// #####################################################################
// #                 Adoptly API Server - Main Entry Point             #
// #####################################################################

// packages/backend/app.js


// * ------------------ Imports ------------------

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const expressSession = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();


//* Import database connection and routers

const db = require('./config/mongoose-connection');
const sellerRouter = require('./routes/sellerRouter');
const petsRouter = require('./routes/petsRouter');
const index = require('./routes/index');
const usersRouter = require('./routes/usersRouter');

// ? The old isLoggedIn middleware needs to be updated for JWT.
const isLoggedIn = require('./middlewares/isLoggedIn');


const app = express();

// #####################################################################
// #                          Core Middleware                          #
// #####################################################################

// ! CRITICAL: CORS must be configured correctly for the React frontend to communicate with the API.
// 1. CORS - Allow requests from your React frontend
app.use(cors({
    origin: 'http://localhost:5173', // The default port for Vite React apps
    credentials: true // Allows cookies to be sent
}));


// 2. Body Parsers - To understand JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// 3. Cookie Parser - To read cookies (useful for JWT in httpOnly cookies)
app.use(cookieParser());


// 4. Static Files (if you have image uploads, etc.)
app.use(express.static(path.join(__dirname, "public")));


app.use(
    expressSession(
    {
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET
    }));
app.use(flash());
app.set("view engine", "ejs");


// #####################################################################
// #                            API Routes                             #
// #####################################################################

// Standard practice to prefix API routes with '/api'

app.use("/", index);
app.use("/users", usersRouter);
app.use("/pets", isLoggedIn, petsRouter);


// * A simple API "health check" route to confirm the server is running.

app.get("/", (req, res) => {
    res.status(200).json({ message: "Adoptly API is running!" });
});


// #####################################################################
// #                           Server Startup                          #
// #####################################################################

// Listen on provided PORT or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);


