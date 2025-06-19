const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/generateToken');
const UserFromDB = require('../models/user_model');


module.exports.registerUser = async function (req, res) {
    try {
        console.log("Received Request Body:", req.body); // Debugging line
        
        let { name, email, password, contact, city, state, country, profile_type } = req.body;

        // Ensure profile_type is received and correct
        if (!profile_type || !["adopter", "seller"].includes(profile_type.toLowerCase())) {
            return res.status(400).json({ message: "Invalid profile type", received: profile_type });
        }

        // Check if user already exists
        const existingUser = await UserFromDB.findOne({ email });
        if (existingUser) {
            return res.status(401).send("User already registered with that email, please sign in");
        }

        const hash = await argon2.hash(password);
        const user = await UserFromDB.create({
            name,
            email,
            password: hash,
            contact,
            address: { city, state, country },
            profile_type: profile_type.toLowerCase(), // Ensure lowercase consistency
        });

        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        res.send("User created successfully");
    } catch (err) {
        console.error("Error in registerUser:", err.message);
        res.status(500).send('Server Error');
    }
};


module.exports.loginUser = async function (req, res)
{
    try
    {
        const { email, password } = req.body;

        // Check if user exists
        const user = await UserFromDB.findOne({ email: email });
        if (!user)
        {
            return res.status(401).send("No user found with the associated email, please register");
        }

        // Check if password is correct
        const match = await argon2.verify(user.password, password);
        if (!match)
        {
            return res.status(401).send("Invalid email or password");
        }

        // Create token
        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 })
        console.log(token);
        res.send("user logged in successfully");
    }
    catch (err)
    {
        // Handle any errors
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports.logoutUser = async function (req, res)
{
    res.clearCookie('token');
    res.send("user logged out successfully");
}

