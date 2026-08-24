const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures one cart document per user email
    lowercase: true,
    trim: true
  },
  products: [
    {
      productId: {
        type: Number, // Matches your numerical product id
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);