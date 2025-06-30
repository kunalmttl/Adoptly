
// #####################################################################
// #           Authentication Middleware (isLoggedIn)                  #
// #####################################################################


//  ------------------ Imports ------------------

const jwt = require('jsonwebtoken');
const UserFromDB = require('../models/user_model');


// #####################################################################
// #                         Middleware Logic                          #
// #####################################################################


module.exports = async function (req, res, next) 
{
    let token;

    // =-= *Best Practice: Check for token in both the Authorization header and cookies.*

    //  1. Check for JWT in Authorization header (standard for APIs)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
    {
        token = req.headers.authorization.split(' ')[1];
    }
    //  2. If not in header, fall back to checking the cookie (good for web clients)
    else if (req.cookies.token) 
    {
        token = req.cookies.token;
    }

    //   If no token is found in either location, deny access.
    if (!token) 
    {
        return res.status(401).json({ message: "Not authorized. No token provided." });
    }

    // ! CRITICAL: Ensure JWT_SECRET is defined in your .env file.
    if (!process.env.JWT_SECRET) 
    {
        console.error("! FATAL ERROR: JWT_SECRET is not defined in .env file!");
        return res.status(500).json({ message: "Internal Server Error: Server is not configured correctly." });
    }

    try 
    {
        //  --- Token Verification ---

        // * Verify the token using the secret key. This will throw an error if it's invalid or expired.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // --- Attach User to Request ---

        // * Use the ID from the decoded token to find the user in the database.
        // * .select('-password') ensures the hashed password is not attached to the request object.
        req.user = await UserFromDB.findById(decoded.id).select('-password');
        
        //  --- Handle Deleted User Edge Case ---

        // * If the user from the token no longer exists, deny access.
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized. User for this token no longer exists.' });
        }

        // * If everything is successful, proceed to the protected route.
        next();

    } 
    catch (error) 
    {
        //  This block catches errors from jwt.verify() (e.g., expired token, invalid signature).
        
        console.error("* Token Verification Error:", error.message);
        return res.status(401).json({ message: "Not authorized. Token is invalid or expired." });
    }
};