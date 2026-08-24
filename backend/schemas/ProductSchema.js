const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    rating: {
        type: Number,
        required: true,
        min: 1.0,
        max: 5.0
    },
    category: {
        type: String,
        required: true,
        enum: ['sportswear', 'electronics', 'appliances', 'mobiles'],
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    photos: {
        type: [String], // Stores public URLs of images uploaded to Cloudflare R2
        validate: [arrayLimit, 'Exceeds the limit of 4 photos']
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

function arrayLimit(val) {
    return val.length <= 4;
}

module.exports = mongoose.model('Product', productSchema);