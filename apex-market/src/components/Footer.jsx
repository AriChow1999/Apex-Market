import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="apex-footer">
            <div className="apex-footer-container">
                
                {/* Main Footer Links Grid (Redesigned into 3 balanced columns) */}
                <div className="apex-footer-grid apex-footer-grid-3col">
                    
                    {/* Brand Column */}
                    <div className="apex-footer-brand-col">
                        <Link to="/" className="apex-brand-link">
                            APEX<span className="apex-brand-accent">MARKET</span>
                        </Link>
                        <p className="apex-footer-about">
                            Elevating your digital shopping experience with high-end curated collections, cutting-edge tech gear, and seamless modern design.
                        </p>
                    </div>

                    {/* Collections Column */}
                    <div className="apex-footer-links-col">
                        <h5>Collections</h5>
                        <ul>
                            <li><Link to="/sportswear">Sportswear</Link></li>
                            <li><Link to="/electronics">Electronics</Link></li>
                            <li><Link to="/appliances">Appliances</Link></li>
                            <li><Link to="/mobiles">Mobiles</Link></li>
                        </ul>
                    </div>

                    {/* Perks / Trust Badges Column (Fills the space gracefully) */}
                    <div className="apex-footer-perks-col">
                        <h5>Why Choose Us</h5>
                        <ul className="apex-perks-list">
                            <li>
                                <ShieldCheck size={16} className="apex-perk-icon" />
                                <span>100% Secure Checkout</span>
                            </li>
                            <li>
                                <Truck size={16} className="apex-perk-icon" />
                                <span>Express Global Delivery</span>
                            </li>
                            <li>
                                <Headphones size={16} className="apex-perk-icon" />
                                <span>24/7 Dedicated Support</span>
                            </li>
                        </ul>
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