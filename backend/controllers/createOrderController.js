const Razorpay = require('razorpay');
const Cart = require('../schemas/CartSchema');
const Product = require('../schemas/ProductSchema'); // Adjust to your product model

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        // 1. Find cart by authenticated user's email
        const cart = await Cart.findOne({ email: req.user.email });
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: 'Cart is empty or not found' });
        }

        let totalAmount = 0;

        // 2. Loop through cart items to calculate the real total from current product prices
        for (const item of cart.products) {
            const productData = await Product.findOne({ id: item.productId });
            if (!productData) {
                return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
            }
            totalAmount += productData.price * item.quantity;
        }

        // 3. Create the order in Razorpay
        const options = {
            amount: totalAmount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Send back the created order details and total
        res.status(200).json({ order, totalAmount });
    } catch (err) {
        console.error('Error creating Razorpay order:', err);
        res.status(500).json({ error: 'Failed to create order' });
    }
};