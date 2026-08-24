const Product =require("../schemas/ProductSchema")

const getProductsByCategory = async (req, res) => {
    try {
        const {category} = req.body;

        if (!category) {
            return res.status(400).json({ message: 'Category is required.' });
        }

        const products = await Product.find({ category });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No data found.' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching products', error: error.message });
    }
};

module.exports=getProductsByCategory;