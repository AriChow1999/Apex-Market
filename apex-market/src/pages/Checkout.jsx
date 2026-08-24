import { useState } from 'react';
import { CreditCard, ShieldCheck, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuthStore } from '../store/ZustandStore';
import './Checkout.css';

const Checkout = () => {
    // Mock cart items for UI preview (in your app, pull this from your Cart state/Zustand store)
    const [cartItems] = useState([
        { id: '1', name: 'Running Shoes Pro Elite', quantity: 1, price: 99.99 },
        { id: '2', name: 'Athletic Compression Sports Socks', quantity: 2, price: 25.00 }
    ]);

    const [shippingData, setShippingData] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const [loading, setLoading] = useState(false);
    const token = useAuthStore((state) => state.token);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = 5.00;
    const finalTotal = subtotal + shippingFee;

    const handleInputChange = (e) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const handleStripeCheckout = async (e) => {
        e.preventDefault();

        if (!shippingData.fullName || !shippingData.address || !shippingData.city) {
            toast.error('Please fill in all required shipping details.');
            return;
        }

        try {
            setLoading(true);

            // 1. Call your backend to create a Stripe Checkout Session
            const response = await axios.post(
                'http://localhost:5000/api/payment/create-checkout-session',
                { items: cartItems, shipping: shippingData },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 2. Redirect user directly to Stripe's secure hosted checkout page
            if (response.data && response.data.url) {
                window.location.href = response.data.url;
            } else {
                toast.error('Failed to initiate payment gateway.');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error processing checkout session';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page-wrapper">
            <div className="checkout-container">
                <div className="checkout-header-area">
                    <h1 className="checkout-title">
                        <CreditCard size={38} color="#4f46e5" /> Secure Checkout
                    </h1>
                    <p className="checkout-subtitle">Provide your delivery information and proceed to secure payment processing.</p>
                </div>

                <div className="checkout-grid">
                    {/* Shipping Address Form */}
                    <div className="checkout-card">
                        <h2 className="checkout-section-title">Shipping Information</h2>
                        <form onSubmit={handleStripeCheckout} className="checkout-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    value={shippingData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Street Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="123 Market Street, Apt 4B"
                                    value={shippingData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="New York"
                                        value={shippingData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        placeholder="10001"
                                        value={shippingData.postalCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="United States"
                                    value={shippingData.country}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="checkout-pay-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Connecting to Stripe...
                                    </>
                                ) : (
                                    <>
                                        Proceed to Stripe Payment <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary & Financial Breakdown */}
                    <div className="checkout-card">
                        <h2 className="checkout-section-title">
                            <ShoppingBag size={22} color="#4f46e5" /> Order Summary ({cartItems.length})
                        </h2>

                        <div className="summary-items-list">
                            {cartItems.map((item) => (
                                <div key={item.id} className="summary-item-row">
                                    <div>
                                        <span className="summary-item-name">{item.name}</span>
                                        <span className="summary-item-qty">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="summary-item-price">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="summary-row-line">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row-line">
                                <span>Estimated Shipping</span>
                                <span>${shippingFee.toFixed(2)}</span>
                            </div>
                            <div className="summary-total-final">
                                <span>Total Due</span>
                                <span className="summary-total-amount">${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="checkout-secure-note">
                            <ShieldCheck size={18} color="#059669" /> Encrypted & Secure 256-bit Stripe SSL Checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;