import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, ArrowRight, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import './Cart.css';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // 1. Fetch cart items
        const cartResponse = await axios.get(`${API_BASE_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const rawCartProducts = cartResponse.data;

        if (!rawCartProducts || rawCartProducts.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // 2. Fetch full product details concurrently
        const detailedItems = await Promise.all(
          rawCartProducts.map(async (item) => {
            try {
              const productRes = await axios.get(`${API_BASE_URL}/product/${item.productId}`);
              const prod = productRes.data;
              return {
                id: prod.id,
                productId: prod.productId || prod.id, // Ensure matches schema
                name: prod.name,
                price: prod.price || 0,
                quantity: item.quantity,
                image: prod.photos && prod.photos.length > 0 ? prod.photos[0] : ''
              };
            } catch (err) {
              console.error(`Failed to fetch details for product ID: ${item.productId}`, err);
              return null;
            }
          })
        );

        setCartItems(detailedItems.filter(Boolean));
      } catch (err) {
        console.error('Fetch Cart Error:', err);
        setError(err.response?.data?.error || 'Failed to load shopping cart.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndProducts();
  }, []);

  const handleUpdateQuantity = async (productId, actionType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/cart`,
        { productId, action: actionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedCartProducts = response.data;

      setCartItems(prev =>
        prev.map(item => {
          const matched = updatedCartProducts.find(p => p.productId === item.id);
          if (matched) {
            return { ...item, quantity: matched.quantity };
          }
          return null;
        }).filter(Boolean)
      );
    } catch (err) {
      console.error('Update Cart Error:', err);
      alert(err.response?.data?.error || 'Failed to update cart quantity.');
    }
  };

  // --- RAZORPAY CHECKOUT HANDLER ---
  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const token = localStorage.getItem('token');

      // 1. Create order on the backend
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/create-order`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order } = orderResponse.data;

      // 2. Configure Razorpay Options
      const options = {
        key: "rzp_test_TQwsZT9ggxYyDR", // Replace with your Razorpay Test Key ID or pass dynamically
        amount: order.amount,
        currency: order.currency,
        name: "Your Store Name",
        description: "Cart Checkout Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify payment signature on the backend
            const verifyResponse = await axios.post(
              `${API_BASE_URL}/api/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              setCartItems([]); // Clear UI cart state
            }
          } catch (err) {
            console.error('Payment Verification Error:', err);
            alert(err.response?.data?.error || 'Payment verification failed.');
          }
        },
        prefill: {
          name: "", 
          email: "", 
        },
        theme: {
          color: "#0f172a"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Checkout Initialization Error:', err);
      alert(err.response?.data?.error || 'Failed to initiate checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 15.00 : 0;
  const totalAmount = subtotal + shipping;
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) {
    return (
      <div className="apex-cart-page">
        <div className="apex-loading-state">
          <div className="apex-spinner"></div>
          <p>Loading your shopping cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apex-cart-page">
        <div className="apex-error-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="apex-cart-page">
      <div className="apex-cart-container">
        <div className="apex-cart-header">
          <h1><ShoppingCart size={28} /> Shopping Cart</h1>
          <p>Review your selected items, adjust quantities, and securely proceed to checkout.</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="apex-empty-cart">
            <ShoppingCart size={56} />
            <h2>Your cart is empty</h2>
            <p>Explore our premium categories and add top-tier products to your bag.</p>
          </div>
        ) : (
          <div className="apex-cart-content">

            {/* Left: Items List */}
            <div className="apex-cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="apex-cart-item-card">
                  <div className="apex-cart-item-thumb">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="apex-cart-item-info">
                    <span className="apex-product-id">ID: {item.id}</span>
                    <h3 className="apex-product-name">{item.name}</h3>
                    <span className="apex-unit-price">₹{item.price.toFixed(2)} each</span>
                  </div>

                  <div className="apex-cart-item-controls">
                    <div className="apex-quantity-stepper">
                      <button onClick={() => handleUpdateQuantity(item.id, 'decrease')}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, 'increase')}>
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="apex-product-amount">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={() => handleUpdateQuantity(item.id, 'remove')}
                      className="apex-remove-btn"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Summary Card */}
            <div className="apex-cart-summary-card">
              <h2>Order Summary</h2>

              <div className="apex-summary-row">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="apex-summary-row">
                <span>Estimated Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>

              <div className="apex-summary-row apex-total-row">
                <span>Total Amount</span>
                <span className="apex-final-amount">₹{totalAmount.toFixed(2)}</span>
              </div>

              <button 
                className="apex-checkout-btn" 
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? 'Processing...' : <>Proceed to Checkout <ArrowRight size={18} /></>}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;