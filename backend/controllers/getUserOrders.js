const Order=require("../schemas/orderSchema")

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};