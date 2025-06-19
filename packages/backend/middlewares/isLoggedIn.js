const jwt = require('jsonwebtoken');
const UserFromDB = require('../models/user_model');

module.exports = async function (req, res, next) 
{
    try 
    {
        if (!req.cookies.token) 
        {
            return res.status(401).json({ message: "You need to log in first" }); // Use JSON instead of redirect
        }

        if (!process.env.JWT_KEY) 
        {
            console.error("JWT_KEY is not defined!");
            return res.status(500).json({ message: "Internal server error" });
        }

        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        req.user = await UserFromDB.findById(decoded.id).select('-password');

        next(); // Continue to the next middleware
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(401).json({ message: "Invalid Token" });
    }
};
