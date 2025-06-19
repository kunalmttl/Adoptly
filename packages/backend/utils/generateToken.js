
// #####################################################################
// #                         JWT Token Utility                         #
// #####################################################################


//  ------------------ Imports ------------------

const jwt = require('jsonwebtoken');



// #####################################################################
// #                         Function Definition                       #
// #####################################################################


/**
 * * Generates a JSON Web Token for a given user.
 * @param {object} user - The user object from the database, which must contain an _id.
 * @returns {string} The generated JWT string.
 */

const generateToken = (user) => 
{

    // ! CRITICAL: This MUST match the variable name in your .env file.
    // ! We standardized on 'JWT_SECRET', so we are changing it from 'JWT_KEY'.
    const secret = process.env.JWT_SECRET;

    //  A robust check to ensure the server is configured correctly.
    if (!secret) 
{
        console.error('! FATAL ERROR: JWT_SECRET is not defined in the .env file. The application cannot sign tokens.');
        // =-= In a real production environment, you might want the app to exit here,
        // =-= as this is a critical configuration failure.
        throw new Error('Server configuration error: JWT secret is missing.');
    }

    //  The payload is the data we are encoding into the token.
    //  It should be minimal and contain only what's necessary for authentication/authorization.
    const payload = 
    {
        id: user._id,
        // =-= Including the user's role or type here can sometimes optimize authorization checks.
        profile_type: user.profile_type
    };

    //  Sign the token with the payload, the secret, and set an expiration time.
    return jwt.sign(payload, secret, 
{
        expiresIn: '1d' 
    });
};



// #####################################################################
// #                               Export                              #
// #####################################################################



//  Export the function for use in other parts of the application (e.g., authController).
//  Using named export for consistency.
module.exports = { generateToken };