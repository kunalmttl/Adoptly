const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema(
{
        name: 
        {
                type: String, 
                required: true
        },
        email: 
        {
                type: String,
                required: true
        },
        password: 
        {
                type: String,
                required: true
        }, 
        contact: 
        {
                type: Number
        },
        picture: 
        {
                type: String
        },

        profile_type: 
        { 
                type: String, 
                enum: ["adopter", "seller"], 
                required: true 

        }, // Dynamic Role Selection
        
        favorites: [
        {
                type: Array,
                default: []
        }],
        address: 
        {
                city: 
                {
                        type: String,
                        required: true
                },
                pincode:
                {
                        type: Number
                },
                state: 
                {
                        type: String,
                        required: true
                },
                country: 
                {
                        type: String,
                        required: true
                }
        },
        shelterDetails: 
        {
                type: String
        },

        bio: 
        {
                type: String
        },

        listed_pets: 
        [{ 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "pet" 

        }], // Pets listed by sellers


        // These fields are used for password reset functionality
        // resetToken stores a unique token sent to user's email when they request a password reset
        // resetTokenExpiration stores when that token expires for security
        // These fields are necessary if the application implements "forgot password" feature
        resetToken: String,
        resetTokenExpiration: Date,

        
});



module.exports = mongoose.model('user', userSchema);
