const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const petSchema = new Schema(
    {
        name: 
        { 
            type: String, 
            required: true 
        },
        species: 
        { 
            type: String, 
            enum: ["dog", "cat", "rabbit", "bird", "other"], 
            required: true 
        },
        breed: 
        { 
            type: String 
        },
        age: 
        { 
            type: Number,  
        }, // Age in years
        gender: 
        { 
            type: String, 
            enum: ["male", "female"], 
        },
        size: 
        { 
            height: 
            {
                type: Number,
            },
            weight: 
            {
                type: Number,
            }
              
        },

        description: 
        { 
            type: String, 
            required: true 
        }, // Short bio about the pet
        
        health_status: 
        {
            vaccinated: 
            { 
                type: Boolean, 
                default: false 
            },

            special_needs: 
            { 
                type: Boolean, 
                default: false 
            },
        },
        adoption_fee: 
        { 
            type: Number, 
            default: 0,
            required: true
        }, // 0 if free adoption

        location: 
        {
            city: 
            { 
                type: String, 
                required: true 
            },
            state: 
            { 
                type: String 
            },
            country: 
            { 
                type: String, 
                required: true 
            }
        },
        images: 
        [{ 
            type: String,
            required: true
        }], // Array of image URLs
        
        listed_by: 
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "user", 
            required: true 
        }, // User who listed the pet
        
        status: 
        {
            type: String, 
            enum: ["available", "pending", "adopted"], 
            default: "available" 
        },
        
        created_at: 
        { 
            type: Date, 
            default: Date.now 
        },
        
        updated_at: 
        { 
            type: Date, 
            default: Date.now 
        }
    },
    { 
        timestamps: true 
    }
);



module.exports = mongoose.model("pet", petSchema);
