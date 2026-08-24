const Product = require("../schemas/ProductSchema")

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findOneAndDelete({ id: productId });

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found with the given ID.' });
        }

        res.status(200).json({
            message: 'Product deleted successfully!',
            category: deletedProduct.category
        });
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ error: 'Server error while deleting product.' });
    }
}

module.exports = deleteProduct