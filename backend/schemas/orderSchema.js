const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  products: [
    {
      productId: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  status: { type: String, default: 'Paid' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);