const Cart = require("../schemas/CartSchema")
const cartFetch = async (req, res) => {
    try {
        const email = req.user?.email;

        if (!email) {
            return res.status(400).json({ error: 'Email not found' });
        }

        const cart = await Cart.findOne({ email });

        if (!cart || !cart.products.length) {
            return res.status(200).json([]);
        }

        res.status(200).json(cart.products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = cartFetch;