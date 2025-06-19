// Import required modules
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./config/mongoose-connection');
const sellerRouter = require('./routes/sellerRouter');
const petsRouter = require('./routes/petsRouter');
const index = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const expressSession = require('express-session');
const flash = require('connect-flash');
const isLoggedIn = require('./middlewares/isLoggedIn');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
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

// Router Setup
app.use("/", index);
app.use("/users", usersRouter);
app.use("/pets", isLoggedIn, petsRouter);


// Root route - renders the 'hello' view
app.get("/", (req, res) => {
    
});


// Start the server
// Listen on provided PORT or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);


