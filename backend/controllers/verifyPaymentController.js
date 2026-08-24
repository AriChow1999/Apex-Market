const Order = require('../schemas/orderSchema');
const Cart = require('../schemas/CartSchema');
const Product = require('../schemas/ProductSchema');
const crypto = require('crypto');
const { Resend } = require('resend');

// Initialize Resend with your API key from Render environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Generate signature hash to verify authenticity
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // 1. Fetch the user's cart
      const cart = await Cart.findOne({ email: req.user.email });
      if (!cart || cart.products.length === 0) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      let totalAmount = 0;
      const orderProducts = [];

      // 2. Build the order snapshot
      for (const item of cart.products) {
        const productData = await Product.findOne({ id: item.productId });
        if (!productData) {
          return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
        }

        totalAmount += productData.price * item.quantity;

        orderProducts.push({
          productId: item.productId,
          name: productData.name,
          price: productData.price,
          quantity: item.quantity
        });
      }

      // 3. Save the permanent Order document
      const newOrder = new Order({
        email: req.user.email,
        products: orderProducts,
        totalAmount: totalAmount,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'Paid'
      });

      await newOrder.save();

      // 4. Delete the cart from the database
      await Cart.findOneAndDelete({ email: req.user.email });

      // 5. Build HTML items list for email receipt
      const itemsListHtml = orderProducts.map(p => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${p.name} (x${p.quantity})</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(p.price * p.quantity).toFixed(2)}</td>
        </tr>
      `).join('');

      // 6. Send email notification via Resend (handled asynchronously)
      try {
        await resend.emails.send({
          from: 'APEX MARKET <onboarding@resend.dev>',
          to: [req.user.email],
          subject: `Order Receipt - #${newOrder._id}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #4f46e5; text-align: center;">ApexMarket Order Receipt</h2>
              <p>Thank you for your purchase! Your payment has been successfully verified.</p>
              <p><strong>Order ID:</strong> ${newOrder._id}</p>
              <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                  <tr style="background-color: #f8fafc;">
                    <th style="padding: 10px; text-align: left;">Item</th>
                    <th style="padding: 10px; text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsListHtml}
                </tbody>
              </table>
              <h3 style="text-align: right; color: #1e293b; margin-top: 20px;">Total Paid: ₹${totalAmount.toFixed(2)}</h3>
              <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 30px;">If you have any questions, feel free to contact our support team.</p>
            </div>
          `
        });
        console.log('Receipt email sent successfully via Resend.');
      } catch (mailErr) {
        console.error('Error sending receipt email:', mailErr);
      }

      // 7. Send final success response back to the frontend
      return res.status(200).json({
        success: true,
        message: "Payment verified, order placed, cart cleared, and receipt emailed successfully!"
      });

    } else {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({ error: 'Verification failed' });
  }
};