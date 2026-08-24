import { useState, useEffect } from 'react';
import { Package, ShoppingBag, X, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import './Orders.css';

const ITEMS_PER_PAGE = 5;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                const response = await axios.get('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setOrders(response.data);
            } catch (err) {
                console.error('Fetch Orders Error:', err);
                setError(err.response?.data?.error || 'Failed to load transaction history.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Calculate pagination bounds
    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (loading) {
        return (
            <div className="orders-page-wrapper">
                <div className="orders-container">
                    <div className="orders-empty">
                        <p>Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-page-wrapper">
                <div className="orders-container">
                    <div className="orders-empty">
                        <p style={{ color: '#ef4444' }}>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page-wrapper">
            <div className="orders-container">
                <div className="orders-header-area">
                    <h1 className="orders-title">
                        <Package size={38} color="#6366f1" /> Order Management & History
                    </h1>
                    <p className="orders-subtitle">Review your past transactions, purchased item breakdowns, and billing receipts.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="orders-empty">
                        <ShoppingBag size={64} className="orders-empty-icon" />
                        <p className="orders-empty-text">No transaction history found.</p>
                    </div>
                ) : (
                    <>
                        <div className="orders-list">
                            {currentOrders.map((order) => {
                                const totalItems = order.products.reduce((sum, item) => sum + item.quantity, 0);
                                const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                                return (
                                    <div 
                                        key={order._id} 
                                        onClick={() => setSelectedOrder(order)}
                                        className="order-banner"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <p className="order-meta">
                                                Order Identifier: <span style={{ color: '#818cf8', fontWeight: '700' }}>#{order._id.toUpperCase()}</span> • <span className="order-date">{formattedDate}</span>
                                            </p>
                                            <p className="order-items-count">
                                                {totalItems} {totalItems === 1 ? 'Item Purchased' : 'Items Purchased'}
                                            </p>
                                        </div>
                                        <div className="order-total-wrapper">
                                            <span className="order-total-label">Total Amount Paid</span>
                                            <span className="order-total-amount">
                                                ₹{order.totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls matching SportsWear structure */}
                        {totalPages > 1 && (
                            <div className="apex-pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
                                <button
                                    className="apex-pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    <ChevronLeft size={16} /> Previous
                                </button>

                                <div className="apex-pagination-numbers" style={{ display: 'flex', gap: '6px' }}>
                                    {Array.from({ length: totalPages }, (_, index) => {
                                        const pageNum = index + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`apex-page-number-btn ${currentPage === pageNum ? 'active' : ''}`}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #cbd5e1',
                                                    background: currentPage === pageNum ? '#6366f1' : '#fff',
                                                    color: currentPage === pageNum ? '#fff' : '#1e293b',
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    className="apex-pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                >
                                    Next <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Grand Polished Popup Modal */}
                {selectedOrder && (
                    <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="modal-close-btn"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="modal-heading">Official Order Receipt</h2>
                            <p className="modal-subheading">
                                Transaction Reference: #{selectedOrder._id} • Processed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>

                            <div className="modal-breakdown-section">
                                <p className="modal-breakdown-title">Itemized Price Breakdown</p>
                                <div className="modal-items-list">
                                    {selectedOrder.products.map((item, index) => (
                                        <div key={index} className="modal-item-row">
                                            <div>
                                                <span className="modal-item-name">{item.name}</span>
                                                <span className="modal-item-qty">Quantity Selected: {item.quantity}</span>
                                            </div>
                                            <span className="modal-item-price">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <span className="modal-footer-label">Total Paid Amount</span>
                                <span className="modal-footer-amount">
                                    ₹{selectedOrder.totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;