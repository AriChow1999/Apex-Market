import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/subscribe', { email });
            setStatus('success');
            setMessage(response.data.message || 'Subscribed successfully! Check your inbox.');
            setEmail('');
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.error || 'Failed to subscribe. Please try again.');
        }
    };

    return (
        <footer className="apex-footer">
            <div className="apex-footer-container">
                
                {/* Main Footer Links Grid */}
                <div className="apex-footer-grid apex-footer-grid-balanced">
                    
                    <div className="apex-footer-brand-col">
                        <Link to="/" className="apex-brand-link">
                            APEX<span className="apex-brand-accent">MARKET</span>
                        </Link>
                        <p className="apex-footer-about">
                            Elevating your digital shopping experience with high-end curated collections, cutting-edge tech gear, and seamless modern design.
                        </p>
                    </div>

                    <div className="apex-footer-links-col">
                        <h5>Collections</h5>
                        <ul>
                            <li><Link to="/sportswear">Sportswear</Link></li>
                            <li><Link to="/electronics">Electronics</Link></li>
                            <li><Link to="/appliances">Appliances</Link></li>
                            <li><Link to="/mobiles">Mobiles</Link></li>
                        </ul>
                    </div>

                    <div className="apex-footer-newsletter-col">
                        <h5>Stay Ahead</h5>
                        <p>Subscribe to receive exclusive drops and VIP deals directly in your inbox.</p>
                        
                        <form onSubmit={handleSubscribe} className="apex-footer-form">
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                disabled={status === 'loading'}
                            />
                            <button type="submit" disabled={status === 'loading'}>
                                {status === 'loading' ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>
                                        <span>Join</span>
                                        <ArrowUpRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Status Message Feedback */}
                        {message && (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                marginTop: '10px', 
                                fontSize: '0.85rem',
                                color: status === 'success' ? '#4ade80' : '#f87171' 
                            }}>
                                {status === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                <span>{message}</span>
                            </div>
                        )}
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="apex-footer-bottom">
                    <p>© {currentYear} APEX MARKET. All rights reserved.</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;