const Product = require("../schemas/ProductSchema");

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOne({ id: productId });

        if (!product) {
            return res.status(404).json({ error: 'Product not found with the given ID.' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Fetch Product Error:', error);
        res.status(500).json({ error: 'Server error while fetching product.' });
    }
};

module.exports = { getProductById };