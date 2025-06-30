
// #####################################################################
// #                          Pet Mongoose Model                       #
// #####################################################################


//  ------------------ Imports ------------------

const mongoose = require("mongoose");


// #####################################################################
// #                           Schema Definition                       #
// #####################################################################

const petSchema = new mongoose.Schema({
    name: 
    {
        type: String,
        required: [true, 'Pet name is required.'],
        trim: true
    },
    species: 
    {
        type: String,
        enum: 
        {
            values: ["dog", "cat", "rabbit", "bird", "other"],
            message: '{VALUE} is not a supported species.'
        },
        required: true,
        lowercase: true
    },
    breed: 
    {
        type: String,
        trim: true
    },
    age: 
    { // Age in years
        type: Number,
        min: [0, 'Age cannot be negative.'],
    },

    gender: 
    {
        type: String,
        enum: ["male", "female"],
        lowercase: true
    },
    size: 
    {
        height: { type: Number, min: 0 }, //  In cm or inches
        weight: { type: Number, min: 0 }  //  In kg or lbs
    },
    description: 
    {
        type: String,
        required: [true, 'A description is required.'],
        maxLength: [1000, 'Description is too long.']
    },
    health_status: 
    {
        vaccinated: { type: Boolean, default: false },
        special_needs: { type: Boolean, default: false },
        // ? You could add a 'details' field for special needs:
        // ? special_needs_details: { type: String }
    },
    adoption_fee: 
    {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Adoption fee cannot be negative.']
    },
    location: 
    {
        city: { type: String, required: true, trim: true },
        state: { type: String, trim: true },
        country: { type: String, required: true, trim: true }
    },
    images: [
    {
        type: String,
        required: [true, 'At least one image is required.']
    }],
    // ! This is the link back to the user who listed the pet.
    listed_by: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", //  This MUST match the model name you used in mongoose.model('user', ...).
        required: true
    },
    status: 
    {
        type: String,
        enum: ["available", "pending", "adopted"],
        default: "available"
    },
}, 
{
    // This option automatically adds and manages `createdAt` and `updatedAt` fields.
    timestamps: true
});


//  Export the model. The collection in MongoDB will be named 'pets'.
module.exports = mongoose.model("pet", petSchema);