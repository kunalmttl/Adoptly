
// #####################################################################
// #                         User Mongoose Model                       #
// #####################################################################


//  ------------------ Imports ------------------

const mongoose = require('mongoose');


// #####################################################################
// #                           Schema Definition                       #
// #####################################################################


const userSchema = new mongoose.Schema({
    name: 
    {
        type: String,
        required: [true, 'Name is required.'], 
        trim: true //  Removes leading/trailing whitespace
    },
    email: 
    {
        type: String,
        required: [true, 'Email is required.'],
        unique: true, 
        lowercase: true, 
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] //  Regex for email validation
    },
    password: 
    {
        type: String,
        required: [true, 'Password is required.'],
        select: false // ! CRITICAL: Hashed password will not be returned in queries by default.
    },
    contact: 
    {
        type: String, // =-= *Changed to String to support formats like +1 (555) 123-4567
        trim: true
    },
    picture: 
    {
        type: String,
        default: 'default-user-avatar.png' // =-= *Providing a default image is good practice.
    },
    profile_type: 
    {
        type: String,
        enum: 
        {
            values: ["adopter", "seller"],
            message: '{VALUE} is not a supported profile type.' // Custom error message for enum
        },
        required: true
    },
    favorites: [
    {
        // ? This assumes you want to store a list of Pet ObjectIDs.
        type: mongoose.Schema.Types.ObjectId,
        ref: "pet"
    }],
    address: 
    {
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        pincode: { type: String, trim: true } 
    },
    bio: 
    {
        type: String,
        maxLength: [500, 'Bio cannot be more than 500 characters.']
    },
    //  A reference to all pets this user has listed (if they are a seller).
    listed_pets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "pet"
    }],

    // ? --- Password Reset Fields ---
    resetToken: String,
    resetTokenExpiration: Date,
}, 
{
    // * Automatically adds `createdAt` and `updatedAt` fields.
    timestamps: true
});


//  Export the model. The collection in MongoDB will be named 'users'.
module.exports = mongoose.model('user', userSchema);