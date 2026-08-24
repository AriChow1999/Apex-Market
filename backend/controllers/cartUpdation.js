const Cart = require("../schemas/CartSchema")


const cartUpdate = async (req, res) => {
    try {
        const email = req.user?.email;
        const { productId, action } = req.body; // action can be 'increase', 'decrease', or 'remove'

        if (!email) {
            return res.status(400).json({ error: 'Email not found' });
        }

        let cart = await Cart.findOne({ email });

        // Fix 1: Create a new cart if it doesn't exist yet
        if (!cart) {
            cart = new Cart({
                email,
                products: [{ productId, quantity: 1 }]
            });
            await cart.save();
            return res.status(200).json(cart.products);
        }

        const itemIndex = cart.products.findIndex(p => p.productId === productId);

        if (action === 'remove') {
            if (itemIndex > -1) {
                cart.products.splice(itemIndex, 1);
            }
        } else if (action === 'increase') {
            if (itemIndex > -1) {
                cart.products[itemIndex].quantity += 1;
            } else {
                // Fix 2: Add the product if it doesn't exist in the cart yet
                cart.products.push({ productId, quantity: 1 });
            }
        } else if (action === 'decrease') {
            if (itemIndex > -1) {
                cart.products[itemIndex].quantity -= 1;
                if (cart.products[itemIndex].quantity === 0) {
                    cart.products.splice(itemIndex, 1);
                }
            }
        }

        await cart.save();
        res.status(200).json(cart.products);
    } catch (err) {
        console.error("Cart Update Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
}


module.exports = cartUpdate